const knex = require('../../database');

module.exports = async (contentListId) => {
  try {
    const pollIds = (
      await knex
        .select('poll_id')
        .from('poll_content_list')
        .where({ content_list_id: contentListId })
    ).map((p) => p.poll_id);

    await knex.transaction(async (trx) => {
      await trx('content_lists').del().where({ id: contentListId });

      for (const pollId of pollIds) {
        pollHasContentList = !!(await trx
          .select()
          .from('poll_content_list')
          .where({ poll_id: pollId })
          .first());

        if (!pollHasContentList) {
          await trx('polls').del().where({ id: pollId });
        }
      }
    });
  } catch (error) {
    throw error;
  }
};
