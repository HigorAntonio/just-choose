const knex = require('../../database');

module.exports = async (options) => {
  const {
    userId,
    getPrivate = false,
    followersIds = [],
    followingIds,
    pageSize,
    page,
    query,
    sortBy,
  } = options;

  if (getPrivate && !userId) {
    throw new Error('Can not get private data without a valid user id');
  }

  try {
    const pollsQuery = knex
      .select(
        'pq.id',
        'pq.user_id',
        'pq.user_name',
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
          'p.id',
          'p.user_id',
          'u.name as user_name',
          'u.profile_image_url',
          'p.title',
          'p.description',
          'p.sharing_option',
          'p.is_active',
          'p.thumbnail',
          'p.created_at',
          'p.updated_at',
          'p.document'
        )
          .from('polls as p')
          .where({ sharing_option: 'public' })
          .innerJoin('users as u', 'user_id', 'u.id')
          .union(function () {
            this.select(
              'p.id',
              'p.user_id',
              'u.name as user_name',
              'u.profile_image_url',
              'p.title',
              'p.description',
              'p.sharing_option',
              'p.is_active',
              'p.thumbnail',
              'p.created_at',
              'p.updated_at',
              'p.document'
            )
              .from('polls as p')
              .where({ sharing_option: 'followed_profiles' })
              .innerJoin('users as u', 'user_id', 'u.id')
              .whereIn('u.id', followersIds);
          })
          .as('pq');
        if (getPrivate) {
          this.union(function () {
            this.select(
              'p.id',
              'p.user_id',
              'u.name as user_name',
              'u.profile_image_url',
              'p.title',
              'p.description',
              'p.sharing_option',
              'p.is_active',
              'p.thumbnail',
              'p.created_at',
              'p.updated_at',
              'p.document'
            )
              .from('polls as p')
              .where({ sharing_option: 'private' })
              .innerJoin('users as u', 'user_id', 'u.id')
              .where({ 'u.id': userId });
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
        .from('polls as p')
        .where({ sharing_option: 'public' })
        .union(function () {
          this.select()
            .from('polls as p')
            .where({ sharing_option: 'followed_profiles' })
            .whereIn('p.user_id', followersIds);
        })
        .as('count_query');
      if (getPrivate) {
        this.union(function () {
          this.select()
            .from('polls as p')
            .where({ sharing_option: 'private' })
            .andWhere({ 'p.user_id': userId });
        });
      }
    });

    if (followingIds) {
      pollsQuery.whereIn('user_id', followingIds);
      countObj.whereIn('user_id', followingIds);
    }

    if (userId) {
      pollsQuery.where({ user_id: userId });
      countObj.where({ user_id: userId });
    }

    if (query) {
      pollsQuery.where(
        knex.raw('document @@ polls_plainto_tsquery(:query)', { query })
      );
      countObj.where(
        knex.raw('document @@ polls_plainto_tsquery(:query)', { query })
      );
    }

    const polls = (await pollsQuery).map((p) => {
      p.total_votes = parseInt(p.total_votes);
      return p;
    });
    const [{ count }] = await countObj;

    return { polls, count: parseInt(count) };
  } catch (error) {
    throw error;
  }
};
