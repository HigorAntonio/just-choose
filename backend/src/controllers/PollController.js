const knex = require('../database');
const deleteFile = require('../utils/deleteFile');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.sendStatus(401);
      }

      const { data } = req.body;
      if (!data) {
        return res.status(400).json({ erro: 'Dados da lista não informados' });
      }

      const { title, description, content_list_id } = JSON.parse(data);

      const errors = [];

      if (!title) {
        errors.push('Título da votação não informado');
      } else if (typeof title !== 'string') {
        errors.push('Título da votação, valor inválido');
      }
      if (description && typeof description !== 'string') {
        errors.push('Descrição da votação, valor inválido');
      }
      if (!req.file) {
        errors.push('Thumbnail da lista não informada');
      }
      if (!content_list_id) {
        errors.push('Lista de conteúdo da votação, id da lista não informado');
      } else if (isNaN(content_list_id)) {
        errors.push('Lista de conteúdo da votação, id da lista inválido');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const contentList = await knex('content_lists')
        .where({ id: content_list_id })
        .first();

      if (!contentList) {
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      const { key: fileKey } = req.file;
      const thumbnail = `${process.env.APP_URL}/files/${fileKey}`;

      await knex.transaction(async (trx) => {
        const [{ id: pollId }] = await trx('polls')
          .insert({ user_id: userId, title, description, thumbnail })
          .returning(['id']);

        await trx('poll_content_list').insert({
          poll_id: pollId,
          content_list_id: content_list_id,
        });
      });

      return res.sendStatus(201);
    } catch (error) {
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

      const pollsQuery = knex('polls')
        .select(
          'polls.id',
          'polls.user_id',
          'users.method as login_method',
          'polls.title',
          'polls.description',
          'polls.thumbnail',
          'poll_content_list.content_list_id',
          'polls.created_at',
          'polls.updated_at'
        )
        .innerJoin('users', 'user_id', 'users.id')
        .innerJoin('poll_content_list', 'poll_id', 'polls.id')
        .limit(page_size)
        .offset((page - 1) * page_size)
        .orderBy('polls.updated_at', 'desc');

      const countObj = knex('polls').count();

      if (user_id) {
        pollsQuery.where('users.id', user_id);
        countObj.where({ user_id });
      }

      const polls = await pollsQuery;
      const [{ count }] = await countObj;

      for (const [i, list] of polls.entries()) {
        // Adiciona o username para usuários logados com o método local
        if (list.login_method === 'local') {
          const { name: userName } = await knex('local_users')
            .select('name')
            .where({ id: list.user_id })
            .first();
          polls[i].user_name = userName;
        }
        // TODO: Adicionar o username para usuário logados com o método Twitch
      }

      const total_pages = Math.ceil(count / page_size);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(page_size),
        total_pages: total_pages === 0 ? 1 : total_pages,
        total_results: parseInt(count),
        items: polls.map((poll) => ({
          id: poll.id,
          user_id: poll.user_id,
          // login_method: poll.login_method,
          user_name: poll.user_name,
          title: poll.title,
          description: poll.description,
          thumbnail: poll.thumbnail,
          content_list_id: poll.content_list_id,
          content_types: poll.content_types,
          created_at: poll.created_at,
          updated_at: poll.updated_at,
        })),
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async update(req, res) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.sendStatus(401);
      }

      const pollId = req.params.id;

      if (isNaN(pollId)) {
        return res.sendStatus(404);
      }

      const poll = await knex('polls')
        .where({
          id: pollId,
        })
        .first();

      if (!poll) {
        return res.status(400).json({ erro: 'Votação não encontrada' });
      }

      if (poll.user_id !== userId) {
        return res.status(403).json({ erro: 'Usuário inválido' });
      }

      const { data } = req.body;
      if (!data) {
        return res.status(400).json({ erro: 'Dados da lista não informados' });
      }

      const { title = poll.title, description = poll.description } = JSON.parse(
        data
      );

      const thumbnail = req.file
        ? `${process.env.APP_URL}/files/${req.file.key}`
        : poll.thumbnail;

      const errors = [];
      if (!title) {
        errors.push('Título da votação não informado');
      } else if (typeof title !== 'string') {
        errors.push('Título da votação, valor inválido');
      }
      if (description && typeof description !== 'string') {
        errors.push('Descrição da votação, valor inválido');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      await knex('polls')
        .update({ title, description, thumbnail })
        .where({ id: pollId });

      if (req.file) {
        await deleteFile(
          poll.thumbnail.substr(`${process.env.APP_URL}/files/`.length)
        );
      }

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) return res.sendStatus(401);

      const poll = await knex('polls').where({ id }).first();

      if (!poll)
        return res.status(400).json({ erro: 'Id de votação inválido' });

      if (poll.user_id !== userId)
        return res.status(403).json({ erro: 'Usuário inválido' });

      await knex('polls').del().where({ id });

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
