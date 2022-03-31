const knex = require('../database');

const getProfile = async (tableKey, tableValue) => {
  const profile = await knex
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
    .where({ [`p.${tableKey}`]: tableValue })
    .first();

  if (profile) {
    profile.followers_count = parseInt(profile.followers_count);
    profile.following_count = parseInt(profile.following_count);
  }

  return profile;
};
