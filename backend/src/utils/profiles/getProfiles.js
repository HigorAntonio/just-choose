const knex = require('../../database');

module.exports = async (options) => {
  const { pageSize, page, query, exactName, sortBy } = options;

  try {
    const profilesQuery = knex
      .select(
        'p.id',
        'p.name',
        'p.profile_image_url',
        knex.raw('COALESCE(followers_count, 0) AS followers_count'),
        knex.raw('COALESCE(following_count, 0) AS following_count')
      )
      .from('profiles as p')
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
      .offset((page - 1) * pageSize);

    if (sortBy) {
      profilesQuery.orderByRaw(sortBy);
    }

    const countObj = knex.count().from('profiles as p');

    if (query) {
      profilesQuery.where(
        knex.raw('p.document @@ profiles_plainto_tsquery(:query)', { query })
      );
      countObj.where(
        knex.raw('p.document @@ profiles_plainto_tsquery(:query)', { query })
      );
    }

    if (exactName) {
      profilesQuery.where({ 'p.name': exactName });
      countObj.where({ 'p.name': exactName });
    }

    const profiles = (await profilesQuery).map((profile) => {
      profile.followers_count = parseInt(profile.followers_count);
      profile.following_count = parseInt(profile.following_count);
      return profile;
    });
    const [{ count }] = await countObj;

    return { profiles, count: parseInt(count) };
  } catch (error) {
    throw error;
  }
};
