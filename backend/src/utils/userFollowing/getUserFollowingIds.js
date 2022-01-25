const knex = require('../../database');

module.exports = async (userId) => {
  try {
    if (!userId) {
      return [];
    }

    return [
      userId,
      ...(
        await knex
          .select('follows_id')
          .from('follows_users')
          .where({ user_id: userId })
      ).map((f) => f.follows_id),
    ];
  } catch (error) {
    throw error;
  }
};
