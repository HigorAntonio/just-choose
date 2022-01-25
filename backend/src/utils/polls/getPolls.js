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
        'pq.content_list_id',
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
          'pcl.content_list_id',
          'p.created_at',
          'p.updated_at',
          'p.document'
        )
          .from('polls as p')
          .where({ sharing_option: 'public' })
          .innerJoin('users as u', 'user_id', 'u.id')
          .innerJoin('poll_content_list as pcl', 'poll_id', 'p.id')
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
              'pcl.content_list_id',
              'p.created_at',
              'p.updated_at',
              'p.document'
            )
              .from('polls as p')
              .where({ sharing_option: 'followed_profiles' })
              .innerJoin('users as u', 'user_id', 'u.id')
              .whereIn('u.id', followersIds)
              .innerJoin('poll_content_list as pcl', 'poll_id', 'p.id');
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
              'pcl.content_list_id',
              'p.created_at',
              'p.updated_at',
              'p.document'
            )
              .from('polls as p')
              .where({ sharing_option: 'private' })
              .innerJoin('users as u', 'user_id', 'u.id')
              .where({ 'u.id': userId })
              .innerJoin('poll_content_list as pcl', 'poll_id', 'p.id');
          });
        }
      })
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

    const polls = await pollsQuery;
    const [{ count }] = await countObj;

    return { polls, count: parseInt(count) };
  } catch (error) {
    throw error;
  }
};
