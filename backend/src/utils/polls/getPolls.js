const knex = require('../../database');

module.exports = async (options) => {
  const {
    profileId,
    getPrivate = false,
    followersIds = [],
    followingIds,
    pageSize,
    page,
    query,
    sortBy,
  } = options;

  if (getPrivate && !profileId) {
    throw new Error('Can not get private data without a valid profile id');
  }

  try {
    const pollsQuery = knex
      .select(
        'pq.id',
        'pq.profile_id',
        'pq.profile_name',
        'pq.profile_display_name',
        'pq.profile_image_url',
        'pq.title',
        'pq.description',
        'pq.sharing_option',
        'pq.is_active',
        'pq.thumbnail',
        'pcls.content_lists',
        knex.raw('COALESCE(total_votes, 0) as total_votes'),
        'pq.created_at',
        'pq.updated_at'
      )
      .from(function () {
        this.select(
          'po.id',
          'po.profile_id',
          'pr.name as profile_name',
          'pr.display_name as profile_display_name',
          'pr.profile_image_url',
          'po.title',
          'po.description',
          'po.sharing_option',
          'po.is_active',
          'po.thumbnail',
          'po.created_at',
          'po.updated_at',
          'po.document'
        )
          .from('polls as po')
          .where({ sharing_option: 'public' })
          .innerJoin('profiles as pr', 'profile_id', 'pr.id')
          .union(function () {
            this.select(
              'po.id',
              'po.profile_id',
              'pr.name as profile_name',
              'pr.display_name as profile_display_name',
              'pr.profile_image_url',
              'po.title',
              'po.description',
              'po.sharing_option',
              'po.is_active',
              'po.thumbnail',
              'po.created_at',
              'po.updated_at',
              'po.document'
            )
              .from('polls as po')
              .where({ sharing_option: 'followed_profiles' })
              .innerJoin('profiles as pr', 'profile_id', 'pr.id')
              .whereIn('pr.id', followersIds);
          })
          .as('pq');
        if (getPrivate) {
          this.union(function () {
            this.select(
              'po.id',
              'po.profile_id',
              'pr.name as profile_name',
              'pr.display_name as profile_display_name',
              'pr.profile_image_url',
              'po.title',
              'po.description',
              'po.sharing_option',
              'po.is_active',
              'po.thumbnail',
              'po.created_at',
              'po.updated_at',
              'po.document'
            )
              .from('polls as po')
              .where({ sharing_option: 'private' })
              .innerJoin('profiles as pr', 'profile_id', 'pr.id')
              .where({ 'pr.id': profileId });
          });
        }
      })
      .innerJoin(
        knex
          .select(
            'pcls.poll_id',
            knex.raw('ARRAY_AGG(pcls.content_list) AS content_lists')
          )
          .from(function () {
            this.select(
              'pcl.poll_id',
              knex.raw(`JSON_BUILD_OBJECT(
              'id', pcl.content_list_id,
              'sharing_option', cl.sharing_option
            ) AS content_list`)
            )
              .from('poll_content_list as pcl')
              .innerJoin('content_lists as cl', 'pcl.content_list_id', 'cl.id')
              .as('pcls');
          })
          .groupBy('pcls.poll_id')
          .as('pcls'),
        'pcls.poll_id',
        'pq.id'
      )
      .leftJoin(
        knex
          .select('poll_id', knex.raw('SUM(votes) AS total_votes'))
          .from(function () {
            this.select()
              .from(function () {
                this.select('poll_id', knex.raw('COUNT(id) AS votes'))
                  .from('movie_votes')
                  .groupBy('poll_id')
                  .as('movie_votes_count');
              })
              .unionAll(function () {
                this.select('poll_id', knex.raw('COUNT(id) AS votes'))
                  .from('show_votes')
                  .groupBy('poll_id');
              })
              .unionAll(function () {
                this.select('poll_id', knex.raw('COUNT(id) AS votes'))
                  .from('game_votes')
                  .groupBy('poll_id');
              })
              .as('poll_votes');
          })
          .groupBy('poll_id')
          .as('poll_total_votes'),
        'poll_total_votes.poll_id',
        'pq.id'
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (sortBy) {
      pollsQuery.orderByRaw(sortBy);
    }

    const countObj = knex.count().from(function () {
      this.select()
        .from('polls as po')
        .where({ sharing_option: 'public' })
        .union(function () {
          this.select()
            .from('polls as po')
            .where({ sharing_option: 'followed_profiles' })
            .whereIn('po.profile_id', followersIds);
        })
        .as('count_query');
      if (getPrivate) {
        this.union(function () {
          this.select()
            .from('polls as po')
            .where({ sharing_option: 'private' })
            .andWhere({ 'po.profile_id': profileId });
        });
      }
    });

    if (followingIds) {
      pollsQuery.whereIn('profile_id', followingIds);
      countObj.whereIn('profile_id', followingIds);
    }

    if (profileId) {
      pollsQuery.where({ profile_id: profileId });
      countObj.where({ profile_id: profileId });
    }

    if (query) {
      pollsQuery.where(
        knex.raw('document @@ polls_plainto_tsquery(:query)', { query })
      );
      countObj.where(
        knex.raw('document @@ polls_plainto_tsquery(:query)', { query })
      );
    }

    const polls = (await pollsQuery).map((poll) => {
      poll.total_votes = parseInt(poll.total_votes);
      return poll;
    });
    const [{ count }] = await countObj;

    return { polls, count: parseInt(count) };
  } catch (error) {
    throw error;
  }
};
