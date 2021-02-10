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

      await knex.transaction(async (trx) => {
        const [{ id: contentListId }] = await trx('content_lists')
          .insert({ user_id: userId, title, description })
          .returning(['id']);

        for (const contentTypeId of contentTypesIds) {
          await trx('content_list_types').insert({
            content_list_id: contentListId,
            content_type_id: contentTypeId,
          });
        }

        const contentListSet = [...new Set(content_list)];
        for (const content of contentListSet) {
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

  async index(req, res) {
    try {
      const { user_id, page = 1, page_size = 30 } = req.query;

      const errors = [];

      if (user_id && isNaN(user_id)) {
        errors.push('O parâmetro user_id deve ser um número');
      } else if (user_id) {
        const user = await knex('users').where({ id: user_id }).first();
        if (!user) {
          errors.push('Usuário não encontrado');
        }
      }
      if (isNaN(page)) {
        errors.push('O parâmetro page deve ser um número');
      } else if (page < 1) {
        errors.push('O parâmetro page inválido. Min 1');
      }
      if (isNaN(page_size)) {
        errors.push('O parâmetro page_size deve ser um número');
      } else if (page_size < 1 || page_size > 100) {
        errors.push('Parâmetro page_size inválido. Min 1, Max 100');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const contentListsQuery = knex('content_lists')
        .select(
          'content_lists.id',
          'content_lists.user_id',
          'users.method as login_method',
          'content_lists.title',
          'content_lists.description',
          'content_lists.created_at',
          'content_lists.updated_at'
        )
        .innerJoin('users', 'user_id', 'users.id')
        .limit(page_size)
        .offset((page - 1) * page_size)
        .orderBy('content_lists.updated_at', 'desc');

      if (user_id) {
        contentListsQuery.where('users.id', user_id);
      }

      const contentLists = await contentListsQuery;

      for (const [i, list] of contentLists.entries()) {
        // Adiciona o username para usuários logados com o método local
        if (list.login_method === 'local') {
          const { name: userName } = await knex('local_users')
            .select('name')
            .where({ id: list.user_id })
            .first();
          contentLists[i].user_name = userName;
        }
        // TODO: Adicionar o username para usuário logados com o método Twitch

        const contentTypes = await knex
          .select('name')
          .from('content_list_types')
          .innerJoin(
            'content_types',
            'content_types.id',
            'content_list_types.content_type_id'
          )
          .andWhere({ content_list_id: list.id });
        contentLists[i].content_types = contentTypes.map((type) => type.name);
      }

      return res.json(
        contentLists.map((list) => ({
          id: list.id,
          user_id: list.user_id,
          // login_method: list.login_method,
          user_name: list.user_name,
          title: list.title,
          description: list.description,
          content_types: list.content_types,
          created_at: list.created_at,
          updated_at: list.updated_at,
        }))
      );
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
