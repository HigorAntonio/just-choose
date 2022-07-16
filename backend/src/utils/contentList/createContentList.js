const knex = require('../../database');
const sanitizeListData = require('./sanitizeListData');

module.exports = async (contentList) => {
  const { profileId, title, description, sharingOption, thumbnail, content } =
    contentList;

  try {
    const [contentTypes, contentToInsert] = await sanitizeListData(content);

    const contentListId = await knex.transaction(async (trx) => {
      const [{ id: contentListId }] = await trx('content_lists')
        .insert({
          profile_id: profileId,
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

      return contentListId;
    });

    return contentListId;
  } catch (error) {
    throw error;
  }
};
