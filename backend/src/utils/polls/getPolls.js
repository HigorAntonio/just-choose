const knex = require('../../database');

module.exports = async (
  userId,
  user_id,
  followMeIds,
  page_size,
  page,
  query,
  sort_by
) => {
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
              .whereIn('u.id', followMeIds)
              .innerJoin('poll_content_list as pcl', 'poll_id', 'p.id');
          })
          .as('pq');
        if (userId && user_id) {
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
      .limit(page_size)
      .offset((page - 1) * page_size);

    if (sort_by) {
      pollsQuery.orderByRaw(sort_by);
    }

    const countObj = knex.count().from(function () {
      this.select()
        .from('polls as p')
        .where({ sharing_option: 'public' })
        .union(function () {
          this.select()
            .from('polls as p')
            .where({ sharing_option: 'followed_profiles' })
            .whereIn('p.user_id', followMeIds);
        })
        .as('count_query');
      if (userId && user_id) {
        this.union(function () {
          this.select()
            .from('polls as p')
            .where({ sharing_option: 'private' })
            .andWhere({ 'p.user_id': userId });
        });
      }
    });

    if (user_id) {
      pollsQuery.where({ user_id });
      countObj.where({ user_id });
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

    return { polls, count };
  } catch (error) {
    throw error;
  }
};
