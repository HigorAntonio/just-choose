const knex = require('../../database');
const sanitizeListData = require('./sanitizeListData');

module.exports = async (
  contentListId,
  title,
  description,
  sharingOption,
  thumbnail,
  content
) => {
  try {
    const [contentTypes, contentToInsert] = content
      ? await sanitizeListData(content)
      : [];

    await knex.transaction(async (trx) => {
      await trx('content_lists')
        .update({
          title,
          description,
          sharing_option: sharingOption,
          thumbnail,
        })
        .where({ id: contentListId });

      if (content) {
        const oldContentTypes = await trx
          .select('ct.name')
          .from('content_list_types as clt')
          .where({
            content_list_id: contentListId,
          })
          .innerJoin('content_types as ct', 'clt.content_type_id', 'ct.id');

        await trx('content_list_types')
          .del()
          .where({ content_list_id: contentListId });

        await trx('content_list_types').insert(
          contentTypes.map((contentType) => ({
            content_list_id: contentListId,
            content_type_id: contentType.id,
          }))
        );

        for (const contentType of oldContentTypes) {
          await trx(`content_list_${contentType.name}s`)
            .del()
            .where({ content_list_id: contentListId });
        }

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
      }
    });
  } catch (error) {
    throw error;
  }
};
