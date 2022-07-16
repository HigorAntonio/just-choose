const knex = require('../../database');

module.exports = async (profileId) => {
  try {
    if (!profileId) {
      return [];
    }

    return [
      profileId,
      ...(
        await knex
          .select('profile_id')
          .from('follows_profiles')
          .where({ follows_id: profileId })
      ).map((f) => f.profile_id),
    ];
  } catch (error) {
    throw error;
  }
};
