const knex = require('../../database');

module.exports = async (profileId, page_size, page) => {
  try {
    const following = await knex
      .select(
        'u.id',
        'u.name',
        'u.profile_image_url',
        knex.raw('COALESCE(followers_count, 0) AS followers_count'),
        knex.raw('COALESCE(following_count, 0) AS following_count'),
        'fu.created_at',
        'fu.updated_at'
      )
      .from('follows_users as fu')
      .where({ 'fu.user_id': profileId })
      .innerJoin('users as u', 'fu.follows_id', 'u.id')
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
      .limit(page_size)
      .offset((page - 1) * page_size)
      .orderBy('u.name');

    const [{ count }] = await knex('follows_users')
      .count()
      .where({ user_id: profileId });

    return { following, count };
  } catch (error) {
    throw error;
  }
};
