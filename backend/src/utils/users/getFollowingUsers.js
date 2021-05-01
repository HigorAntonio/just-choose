const knex = require('../../database');

module.exports = async (userId) => {
  try {
    return userId
      ? [
          { user_id: userId },
          ...(await knex
            .select('user_id')
            .from('follows_users')
            .where({ follows_id: userId })),
        ]
      : [];
  } catch (error) {
    throw error;
  }
};
