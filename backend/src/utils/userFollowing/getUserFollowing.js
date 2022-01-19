const knex = require('../../database');

module.exports = async (options) => {
  const { profileId, pageSize, page } = options;

  try {
    const followingQuery = knex
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
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy('u.name');

    const [{ count }] = await knex('follows_users')
      .count()
      .where({ user_id: profileId });

    const following = (await followingQuery).map((f) => {
      f.followers_count = parseInt(f.followers_count);
      f.following_count = parseInt(f.following_count);
      return f;
    });

    return { following, count };
  } catch (error) {
    throw error;
  }
};
