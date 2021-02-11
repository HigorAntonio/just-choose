const knex = require('../database');

module.exports = {
  async update(req, res) {
    try {
      const userId = req.userId;

      if (!userId) return res.sendStatus(401);

      const contentListId = req.params.id;

      if (isNaN(contentListId)) {
        return res.sendStatus(404);
      }

      const { content_types } = req.body;
      const contentTypesIds = [];
      const errors = [];

      if (!content_types) {
        errors.push('Tipos de conteúdo da lista não informados');
      } else if (!Array.isArray(content_types)) {
        errors.push('Tipos de conteúdo da lista, valor inválido');
      } else if (!content_types.length) {
        errors.push('Tipos de conteúdo da lista não informados');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const contentList = await knex('content_lists')
        .where({
          id: contentListId,
        })
        .first();

      if (!contentList) {
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      if (contentList.user_id !== userId) {
        return res.status(403).json({ erro: 'Usuário inválido' });
      }

      const contentTypesSet = [...new Set(content_types)];
      for (const name of contentTypesSet) {
        let contentTypeId = await knex
          .select('id')
          .from('content_types')
          .where({ name })
          .first();
        if (!contentTypeId) {
          return res
            .status(400)
            .json({ erro: `Tipo de conteúdo '${name}' inválido` });
        }
        contentTypesIds.push(contentTypeId.id);
      }

      const prevContentTypesIds = (
        await knex('content_list_types')
          .select('content_types.id')
          .where({ content_list_id: contentList.id })
          .innerJoin('content_types', 'content_type_id', 'content_types.id')
      ).map((type) => type.id);

      const contentTypesToInsert = contentTypesIds.filter(
        (type) => !prevContentTypesIds.includes(type)
      );
      const contentTypesToDelete = prevContentTypesIds.filter(
        (type) => !contentTypesIds.includes(type)
      );

      await knex.transaction(async (trx) => {
        for (let contentTypeId of contentTypesToDelete) {
          await trx('content_list_types').del().where({
            content_list_id: contentListId,
            content_type_id: contentTypeId,
          });
        }

        for (let contentTypeId of contentTypesToInsert) {
          await trx('content_list_types').insert({
            content_list_id: contentListId,
            content_type_id: contentTypeId,
          });
        }
      });

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },
};
