const knex = require('../../database');

module.exports = async (profileId, followsId) => {
  try {
    if (!profileId || !followsId) {
      return false;
    }
    if (parseInt(profileId) === parseInt(followsId)) {
      return true;
    }
    const following = await knex
      .select('profile_id')
      .from('follows_profiles')
      .where({ profile_id: profileId, follows_id: followsId })
      .first();

    return following ? true : false;
  } catch (error) {
    throw error;
  }
};
