const knex = require('../database');
const deleteFile = require('../utils/deleteFile');
const getUserFollowersIds = require('../utils/userFollowers/getUserFollowersIds');
const isUserFollowing = require('../utils/users/isUserFollowing');
const getPollOrderByQuery = require('../utils/polls/getPollOrderByQuery');
const getPolls = require('../utils/polls/getPolls');
const getPoll = require('../utils/polls/getPoll');
const getContentList = require('../utils/contentList/getContentList');
const getPollResult = require('../utils/polls/getPollResult');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.userId;

      const { data } = req.body;
      if (!data) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erro: 'Dados da lista não informados' });
      }

      const {
        title,
        description,
        sharingOption = 'private',
        contentListId,
      } = JSON.parse(data);

      const errors = [];

      if (!title) {
        errors.push('Título da votação não informado');
      } else if (typeof title !== 'string') {
        errors.push('Título da votação, valor inválido');
      }
      if (description && typeof description !== 'string') {
        errors.push('Descrição da votação, valor inválido');
      }
      if (
        typeof sharingOption !== 'undefined' &&
        sharingOption !== 'private' &&
        sharingOption !== 'public' &&
        sharingOption !== 'followed_profiles'
      ) {
        errors.push('Opção de compartilhamento da votação, valor inválido');
      }
      if (!req.file) {
        errors.push('Thumbnail da votação não informada');
      }
      if (!contentListId) {
        errors.push('Lista de conteúdo da votação, id da lista não informado');
      } else if (isNaN(contentListId)) {
        errors.push('Lista de conteúdo da votação, id da lista inválido');
      }
      if (errors.length > 0) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erros: errors });
      }

      const contentList = await knex('content_lists')
        .where({ id: contentListId })
        .first();

      if (!contentList) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }
      // O usuário só pode criar votações a partir de listas criadas pelo próprio usuário.
      // O usuário pode fazer um fork de uma lista de outro usuário. A lista fork poderá
      // ser usada para criar uma votação.
      if (contentList.user_id !== userId) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(403).json({
          erro: 'A lista de conteúdo informada não pertence ao usuário',
        });
      }

      const { key: fileKey } = req.file;
      const thumbnail = `${process.env.APP_URL}/files/${fileKey}`;

      const pollId = await knex.transaction(async (trx) => {
        const [{ id: pollId }] = await trx('polls')
          .insert({
            user_id: userId,
            title,
            description,
            sharing_option: sharingOption,
            thumbnail,
          })
          .returning(['id']);

        await trx('poll_content_list').insert({
          poll_id: pollId,
          content_list_id: contentListId,
        });

        return pollId;
      });

      return res.status(201).json({ id: pollId });
    } catch (error) {
      try {
        await deleteFile(req.file.key);
      } catch (error) {}
      return res.sendStatus(500);
    }
  },

  async index(req, res) {
    try {
      const authUserId = req.userId;

      const {
        user_id: reqUserId,
        query,
        page = 1,
        page_size: pageSize = 30,
        sort_by: sortBy = 'updated.desc',
      } = req.query;

      const errors = [];

      if (reqUserId && isNaN(reqUserId)) {
        errors.push('O parâmetro user_id deve ser um número');
      } else if (reqUserId) {
        const user = await knex('users').where({ id: reqUserId }).first();
        if (!user) {
          errors.push('Usuário não encontrado');
        }
      }
      if (query && typeof query !== 'string') {
        errors.push({ erro: 'O parâmetro query deve ser uma string' });
      }
      if (isNaN(page)) {
        errors.push('O parâmetro page deve ser um número');
      } else if (page < 1) {
        errors.push('O parâmetro page inválido. Min 1');
      }
      if (isNaN(pageSize)) {
        errors.push('O parâmetro page_size deve ser um número');
      } else if (pageSize < 1 || pageSize > 100) {
        errors.push('Parâmetro page_size inválido. Min 1, Max 100');
      }
      if (sortBy) {
        if (typeof sortBy !== 'string') {
          errors.push('O parâmetro sort_by deve ser uma string');
        } else if (!getPollOrderByQuery(sortBy)) {
          errors.push('Parâmetro sort_by, valor inválido');
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const followersIds = await getUserFollowersIds(authUserId);

      const { polls, count } = await getPolls({
        userId: reqUserId,
        getPrivate: parseInt(authUserId) === parseInt(reqUserId),
        followersIds,
        pageSize,
        page,
        query,
        sortBy: getPollOrderByQuery(sortBy),
      });

      const totalPages = Math.ceil(count / pageSize);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(pageSize),
        total_pages: totalPages === 0 ? 1 : totalPages,
        total_results: count,
        results: polls,
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const userId = req.userId;

      const pollId = req.params.id;

      if (isNaN(pollId)) {
        return res.status(400).json({ erro: 'Id da votação, valor inválido' });
      }

      const poll = await getPoll(pollId);

      if (!poll) {
        return res.status(400).json({ erro: 'Votação não encontrada' });
      }

      if (
        (poll.sharing_option === 'private' && poll.user_id !== userId) ||
        (poll.sharing_option === 'followed_profiles' &&
          !(await isUserFollowing(poll.user_id, userId)))
      ) {
        return res.sendStatus(403);
      }

      return res.json(poll);
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async update(req, res) {
    try {
      const userId = req.userId;

      const pollId = req.params.id;

      if (isNaN(pollId)) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erro: 'Id da votação, valor inválido' });
      }

      const poll = await knex('polls')
        .where({
          id: pollId,
        })
        .first();

      if (!poll) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erro: 'Votação não encontrada' });
      }

      if (poll.user_id !== userId) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(403).json({ erro: 'Usuário inválido' });
      }

      const { data } = req.body;
      if (!data) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erro: 'Dados da lista não informados' });
      }

      const {
        title = poll.title,
        description = poll.description,
        sharingOption = poll.sharing_option,
        isActive = poll.is_active,
      } = JSON.parse(data);

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
      if (
        sharingOption !== 'private' &&
        sharingOption !== 'public' &&
        sharingOption !== 'followed_profiles'
      ) {
        errors.push('Opção de compartilhamento da votação, valor inválido');
      }
      if (isActive && typeof isActive !== 'boolean') {
        errors.push('Votação ativa, valor inválido');
      }
      if (errors.length > 0) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erros: errors });
      }

      await knex('polls')
        .update({
          title,
          description,
          thumbnail,
          sharing_option: sharingOption,
          is_active: isActive,
        })
        .where({ id: pollId });

      if (req.file) {
        await deleteFile(
          poll.thumbnail.substr(`${process.env.APP_URL}/files/`.length)
        );
      }

      return res.sendStatus(200);
    } catch (error) {
      try {
        await deleteFile(req.file.key);
      } catch (error) {}
      return res.sendStatus(500);
    }
  },

  async delete(req, res) {
    try {
      const userId = req.userId;

      const pollId = req.params.id;

      if (isNaN(pollId)) {
        return res.status(400).json({ erro: 'Id da votação, valor inválido' });
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

      await knex('polls').del().where({ id: pollId });

      await deleteFile(
        poll.thumbnail.substr(`${process.env.APP_URL}/files/`.length)
      );

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
