const knex = require('../../database');

module.exports = async (
  userId,
  user_id,
  followMeIds,
  page_size,
  page,
  sort_by
) => {
  try {
    const contentListsQuery = knex
      .select(
        'clsq.id',
        'clsq.user_id',
        'clsq.user_name',
        'clsq.title',
        'clsq.description',
        'clsq.sharing_option',
        'clsq.thumbnail',
        'content_types',
        knex.raw('COALESCE(likes, 0) AS likes'),
        knex.raw('COALESCE(forks, 0) AS forks'),
        'clsq.created_at',
        'clsq.updated_at'
      )
      .from(function () {
        this.select(
          'cl.id',
          'cl.user_id',
          'u.name as user_name',
          'cl.title',
          'cl.description',
          'cl.sharing_option',
          'cl.thumbnail',
          'cl.created_at',
          'cl.updated_at'
        )
          .from('content_lists as cl')
          .where({ sharing_option: 'public' })
          .innerJoin('users as u', 'cl.user_id', 'u.id')
          .union(function () {
            this.select(
              'cl.id',
              'cl.user_id',
              'u.name as user_name',
              'cl.title',
              'cl.description',
              'cl.sharing_option',
              'cl.thumbnail',
              'cl.created_at',
              'cl.updated_at'
            )
              .from('content_lists as cl')
              .where({ sharing_option: 'followed_profiles' })
              .innerJoin('users as u', 'cl.user_id', 'u.id')
              .whereIn('u.id', followMeIds);
          })
          .as('clsq');
        if (userId && user_id) {
          this.union(function () {
            this.select(
              'cl.id',
              'cl.user_id',
              'u.name as user_name',
              'cl.title',
              'cl.description',
              'cl.sharing_option',
              'cl.thumbnail',
              'cl.created_at',
              'cl.updated_at'
            )
              .from('content_lists as cl')
              .where({ sharing_option: 'private' })
              .innerJoin('users as u', 'cl.user_id', 'u.id')
              .where({ 'u.id': userId });
          });
        }
      })
      .leftJoin(
        knex
          .select(
            'content_list_id as list_id',
            knex.raw('ARRAY_AGG(ct.name) AS content_types')
          )
          .from('content_list_types')
          .innerJoin('content_types as ct', 'content_type_id', 'ct.id')
          .groupBy('list_id')
          .as('clt'),
        'clt.list_id',
        'clsq.id'
      )
      .leftJoin(
        knex
          .select('content_list_id as list_id', knex.raw('COUNT(*) AS likes'))
          .from('content_list_likes')
          .groupBy('list_id')
          .as('cll'),
        'cll.list_id',
        'clsq.id'
      )
      .leftJoin(
        knex
          .select('original_list_id as list_id', knex.raw('COUNT(*) AS forks'))
          .from('content_list_forks')
          .groupBy('list_id')
          .as('clf'),
        'clf.list_id',
        'clsq.id'
      )
      .limit(page_size)
      .offset((page - 1) * page_size)
      .orderByRaw(sort_by);

    const countObj = knex.count().from(function () {
      this.select()
        .from(function () {
          this.select('cl.id', 'cl.user_id')
            .from('content_lists as cl')
            .where({ sharing_option: 'public' })
            .as('public_lists');
        })
        .union(function () {
          this.select('cl.id', 'cl.user_id')
            .from('content_lists as cl')
            .where({ sharing_option: 'followed_profiles' })
            .whereIn('cl.user_id', followMeIds);
        })
        .as('count_query');
      if (userId && user_id) {
        this.union(function () {
          this.select('cl.id', 'cl.user_id')
            .from('content_lists as cl')
            .where({ sharing_option: 'private' })
            .where('cl.user_id', userId);
        });
      }
    });

    if (user_id) {
      contentListsQuery.where({ user_id });
      countObj.where({ user_id });
    }

    const contentLists = await contentListsQuery;
    const [{ count }] = await countObj;

    return { contentLists, count };
  } catch (error) {
    throw error;
  }
};
