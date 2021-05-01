const knex = require('../../database');
const sanitizeListData = require('./sanitizeListData');

module.exports = async (
  userId,
  title,
  description,
  sharingOption,
  thumbnail,
  content
) => {
  try {
    const [contentTypes, contentToInsert] = await sanitizeListData(content);

    await knex.transaction(async (trx) => {
      const [{ id: contentListId }] = await trx('content_lists')
        .insert({
          user_id: userId,
          title,
          description,
          sharing_option: sharingOption,
          thumbnail,
        })
        .returning(['id']);

      await trx('content_list_types').insert(
        contentTypes.map((contentType) => ({
          content_list_id: contentListId,
          content_type_id: contentType.id,
        }))
      );

      for (const contentType of contentTypes) {
        await trx(`content_list_${contentType.name}s`).insert(
          contentToInsert[`content_list_${contentType.name}s`].map(
            (contentId) => ({
              content_list_id: contentListId,
              [`${contentType.name}_id`]: contentId,
            })
          )
        );
      }
    });
  } catch (error) {
    throw error;
  }
};
