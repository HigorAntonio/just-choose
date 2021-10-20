const knex = require('../../database');

module.exports = async (userId) => {
  try {
    const user = await knex
      .select(
        'id',
        'name',
        'email',
        'profile_image_url',
        'method',
        'is_active',
        knex.raw('COALESCE(followers_count, 0) AS followers_count'),
        knex.raw('COALESCE(following_count, 0) AS following_count')
      )
      .from('users as u')
      .leftJoin(
        knex
          .select('follows_id', knex.raw('COUNT(*) AS followers_count'))
          .from('follows_users')
          .groupBy('follows_id')
          .as('fers'),
        'u.id',
        'fers.follows_id'
      )
      .leftJoin(
        knex
          .select('user_id', knex.raw('COUNT(*) AS following_count'))
          .from('follows_users')
          .groupBy('user_id')
          .as('fing'),
        'u.id',
        'fing.user_id'
      )
      .where({ 'u.id': userId })
      .first();

    return user;
  } catch (error) {
    throw error;
  }
};
