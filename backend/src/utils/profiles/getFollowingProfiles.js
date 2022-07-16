const knex = require('../../database');

module.exports = async (profileId) => {
  try {
    return profileId
      ? [
          { profile_id: profileId },
          ...(await knex
            .select('profile_id')
            .from('follows_profiles')
            .where({ follows_id: profileId })),
        ]
      : [];
  } catch (error) {
    throw error;
  }
};
