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
          .select('follows_id')
          .from('follows_profiles')
          .where({ profile_id: profileId })
      ).map((f) => f.follows_id),
    ];
  } catch (error) {
    throw error;
  }
};
