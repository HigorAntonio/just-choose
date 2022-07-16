const knex = require('../database');
const copyFile = require('../utils/copyFile');
const deleteFile = require('../utils/deleteFile');
const isProfileFollowing = require('../utils/profiles/isProfileFollowing');
const logger = require('../lib/logger');

module.exports = {
  async create(req, res) {
    let thumbnail;
    try {
      const profileId = req.profileId;

      const originalListId = req.params.id;
      if (!originalListId) {
        return res
          .status(400)
          .json({ erro: 'Id da lista original não informado' });
      }
      if (isNaN(originalListId)) {
        return res
          .status(400)
          .json({ erro: 'Id da lista original valor inválido' });
      }

      const originalList = await knex
        .select()
        .from('content_lists')
        .where({ id: originalListId })
        .first();

      if (!originalList) {
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      if (
        (originalList.sharing_option === 'private' &&
          originalList.profile_id !== profileId) ||
        (originalList.sharing_option === 'followed_profiles' &&
          !(await isProfileFollowing(originalList.profile_id, profileId)))
      ) {
        return res.sendStatus(403);
      }

      const originalListContentTypes = await knex
        .select('ct.id', 'ct.name')
        .from('content_list_types as clt')
        .innerJoin('content_types as ct', 'clt.content_type_id', 'ct.id')
        .andWhere({
          ['clt.content_list_id']: originalListId,
        });

      thumbnail = `${process.env.APP_URL}/files/${copyFile(
        originalList.thumbnail.substring(`${process.env.APP_URL}/files/`.length)
      )}`;

      const forkedListId = await knex.transaction(async (trx) => {
        const [{ id: contentListId }] = await trx('content_lists')
          .insert({
            profile_id: profileId,
            title: originalList.title,
            description: originalList.description,
            thumbnail,
          })
          .returning(['id']);

        await trx('content_list_types').insert(
          originalListContentTypes.map((contentType) => ({
            content_list_id: contentListId,
            content_type_id: contentType.id,
          }))
        );

        for (const contentType of originalListContentTypes) {
          const content = (
            await knex
              .select(`${contentType.name}_id`)
              .from(`content_list_${contentType.name}s`)
              .where({ content_list_id: originalList.id })
          ).map((content) => ({
            [`${contentType.name}_id`]: content[`${contentType.name}_id`],
            content_list_id: contentListId,
          }));

          await trx(`content_list_${contentType.name}s`).insert(content);
        }

        await trx('content_list_forks').insert({
          original_list_id: originalList.id,
          forked_list_id: contentListId,
        });

        return contentListId;
      });

      return res.status(201).json({ forked_list_id: forkedListId });
    } catch (error) {
      try {
        await deleteFile(thumbnail);
      } catch (error) {}
      logger.error(error);
      return res.sendStatus(500);
    }
  },
};
