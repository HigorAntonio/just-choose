const knex = require('../../database');

module.exports = async (options) => {
  const { profileId, pageSize, page } = options;

  try {
    const followersQuery = knex
      .select(
        'p.id',
        'p.name',
        'p.profile_image_url',
        knex.raw('COALESCE(followers_count, 0) AS followers_count'),
        knex.raw('COALESCE(following_count, 0) AS following_count'),
        'fp.created_at',
        'fp.updated_at'
      )
      .from('follows_profiles as fp')
      .where({ 'fp.follows_id': profileId })
      .innerJoin('profiles as p', 'fp.profile_id', 'p.id')
      .leftJoin(
        knex
          .select('follows_id', knex.raw('COUNT(*) AS followers_count'))
          .from('follows_profiles')
          .groupBy('follows_id')
          .as('fers'),
        'p.id',
        'fers.follows_id'
      )
      .leftJoin(
        knex
          .select('profile_id', knex.raw('COUNT(*) AS following_count'))
          .from('follows_profiles')
          .groupBy('profile_id')
          .as('fing'),
        'p.id',
        'fing.profile_id'
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy('p.name');

    const [{ count }] = await knex('follows_profiles')
      .count()
      .where({ follows_id: profileId });

    const followers = (await followersQuery).map((f) => {
      f.followers_count = parseInt(f.followers_count);
      f.following_count = parseInt(f.following_count);
      return f;
    });

    return { followers, count: parseInt(count) };
  } catch (error) {
    throw error;
  }
};
