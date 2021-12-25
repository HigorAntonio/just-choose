const knex = require('../../database');

module.exports = async (userId, followsId) => {
  try {
    if (!userId || !followsId) {
      return false;
    }
    if (parseInt(userId) === parseInt(followsId)) {
      return true;
    }
    const following = await knex
      .select('user_id')
      .from('follows_users')
      .where({ user_id: userId, follows_id: followsId })
      .first();

    return following ? true : false;
  } catch (error) {
    throw error;
  }
};
