const knex = require('../../database');

module.exports = async (userId, user_id, followMeIds, page_size, page) => {
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
          .where({ 'u.id': user_id })
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
              .whereIn('u.id', followMeIds)
              .andWhere({ 'u.id': user_id });
          })
          .as('clsq');
        if (userId) {
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
              .where({ 'u.id': userId })
              .andWhere({ 'u.id': user_id });
          });
        }
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
            .andWhere({ 'cl.user_id': user_id })
            .as('public_lists');
        })
        .union(function () {
          this.select('cl.id', 'cl.user_id')
            .from('content_lists as cl')
            .where({ sharing_option: 'followed_profiles' })
            .whereIn('cl.user_id', followMeIds)
            .andWhere({ 'cl.user_id': user_id });
        })
        .as('count_query');
      if (userId) {
        this.union(function () {
          this.select('cl.id', 'cl.user_id')
            .from('content_lists as cl')
            .where({ sharing_option: 'private' })
            .where('cl.user_id', userId)
            .andWhere({ 'cl.user_id': user_id });
        });
      }
    });

    return { contentLists, count };
  } catch (error) {
    throw error;
  }
};
