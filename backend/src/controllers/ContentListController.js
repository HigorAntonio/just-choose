const knex = require('../database');
const { MovieValidationError } = require('../errors');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.sendStatus(401);
      }

      const {
        title,
        description,
        content_types,
        content: content_list,
      } = req.body;

      const contentTypesIds = [];
      const errors = [];

      if (!title) {
        errors.push('Título da lista não informado');
      }
      if (!content_types) {
        errors.push('Tipos de conteúdo da lista não informados');
      }
      if (!content_list) {
        errors.push('Conteúdo da lista não informado');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      for (let name of content_types) {
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

      await knex.transaction(async (trx) => {
        const [{ id: contentListId }] = await trx('content_lists')
          .insert({ user_id: userId, title, description })
          .returning(['id']);

        for (let contentTypeId of contentTypesIds) {
          await trx('content_list_types').insert({
            content_list_id: contentListId,
            content_type_id: contentTypeId,
          });
        }

        for (let content of content_list) {
          if (content.type === 'movie') {
            const movie = await knex
              .select('id')
              .from('movies')
              .where({ id: content.contentId })
              .first();
            if (!movie) {
              throw new MovieValidationError(
                `Movie id '${content.contentId}' inválido`
              );
            }
            await trx('content_list_movies').insert({
              content_list_id: contentListId,
              movie_id: content.contentId,
            });
          }
        }
      });

      return res.sendStatus(201);
    } catch (error) {
      if (error instanceof MovieValidationError) {
        return res.status(400).json({ erro: error.message });
      }
      return res.sendStatus(500);
    }
  },
};
