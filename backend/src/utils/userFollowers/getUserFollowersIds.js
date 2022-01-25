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
          .select('user_id')
          .from('follows_users')
          .where({ follows_id: userId })
      ).map((f) => f.user_id),
    ];
  } catch (error) {
    throw error;
  }
};
