const knex = require('../../database');
const getPlatformId = require('../getPlatformId');

module.exports = async (content) => {
  try {
    const contentNames = [...new Set(content.map((c) => c.type))];
    const contentTypes = await knex('content_types')
      .select('id', 'name')
      .whereIn('name', contentNames);

    const contentToInsert = {};
    contentNames.forEach(
      (name) => (contentToInsert[`content_list_${name}s`] = [])
    );
    for (const c of content) {
      contentToInsert[`content_list_${c.type}s`].push(c.contentId);
    }

    // Removendo ids duplicados e ids de conteúdos que não existem no banco de dados
    for (const type of contentTypes) {
      let platformId = getPlatformId(type.name);
      contentToInsert[`content_list_${type.name}s`] = (
        await knex
          .select('id')
          .from(`${type.name}s`)
          .whereIn(platformId, contentToInsert[`content_list_${type.name}s`])
      ).map((content) => content.id);
    }

    return [contentTypes, contentToInsert];
  } catch (error) {
    throw error;
  }
};
