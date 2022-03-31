const bcrypt = require('bcryptjs');
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

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

exports.getProfileById = (profileId) => {
  return getProfile('id', profileId);
};

exports.getProfileByName = (profileName) => {
  return getProfile('name', profileName);
};

exports.getProfileByEmail = (profileEmail) => {
  return getProfile('email', profileEmail);
};

exports.saveProfile = ({ name, email, password }) => {
  return knex.transaction(async (trx) => {
    const [profileId] = await trx('profiles').insert(
      { name, email, method: 'local' },
      'id'
    );

    await trx('local_profiles').insert({
      profile_id: profileId,
      password: encryptPassword(password),
    });

    return profileId;
  });
};

exports.deleteProfile = (profileId) => {
  return knex('profiles').where({ id: profileId }).del();
};
