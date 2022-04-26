const knex = require('../database');
const localAuthUtils = require('../utils/localAuth');

const getProfile = async (tableKey, tableValue) => {
  const profile = await knex
    .select(
      'p.id',
      'p.name',
      'p.email',
      'p.profile_image_url',
      'p.method',
      'p.is_active',
      'lp.password'
    )
    .from('profiles as p')
    .innerJoin('local_profiles as lp', 'p.id', 'lp.id')
    .where({ [`p.${tableKey}`]: tableValue })
    .first();

  return profile;
};

exports.getLocalProfileById = (profileId) => {
  return getProfile('id', profileId);
};

exports.getLocalProfileByName = (profileName) => {
  return getProfile('name', profileName);
};

exports.getLocalProfileByEmail = (profileEmail) => {
  return getProfile('email', profileEmail);
};

exports.saveLocalProfile = ({ name, email, password }) => {
  return knex.transaction(async (trx) => {
    const [profileId] = await trx('profiles').insert(
      { name, email, method: 'local' },
      'id'
    );

    await trx('local_profiles').insert({
      profile_id: profileId,
      password: localAuthUtils.encryptPassword(password),
    });

    return profileId;
  });
};

exports.updatePasswordLocalProfile = (profileId, newPassword) => {
  return knex('local_profiles')
    .update({ password: localAuthUtils.encryptPassword(newPassword) })
    .where({ profile_id: profileId });
};

exports.deleteLocalProfile = (profileId) => {
  return knex('profiles').where({ id: profileId }).del();
};
