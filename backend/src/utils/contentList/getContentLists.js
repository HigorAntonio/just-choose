const knex = require('../../database');

module.exports = async (followMeIds, page_size, page) => {
  try {
    const contentLists = await knex
      .select()
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
      })
      .limit(page_size)
      .offset((page - 1) * page_size)
      .orderBy('updated_at', 'desc');

    const [{ count }] = await knex.count().from(function () {
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
    });

    return { contentLists, count };
  } catch (error) {
    throw error;
  }
};
