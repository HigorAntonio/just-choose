const knex = require('../database');
const deleteFile = require('../utils/deleteFile');
const getFollowingUsers = require('../utils/users/getFollowingUsers');
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
      const userId = req.userId;

      const {
        user_id,
        query,
        page = 1,
        page_size = 30,
        sort_by = 'updated.desc',
      } = req.query;

      const errors = [];

      if (user_id && isNaN(user_id)) {
        errors.push('O parâmetro user_id deve ser um número');
      } else if (user_id) {
        const user = await knex('users').where({ id: user_id }).first();
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
      if (isNaN(page_size)) {
        errors.push('O parâmetro page_size deve ser um número');
      } else if (page_size < 1 || page_size > 100) {
        errors.push('Parâmetro page_size inválido. Min 1, Max 100');
      }
      if (sort_by) {
        if (typeof sort_by !== 'string') {
          errors.push('Parâmetro sort_by, valor inválido');
        } else if (!getPollOrderByQuery(sort_by)) {
          errors.push('Parâmetro sort_by, valor inválido');
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const usersWhoFollowMe = await getFollowingUsers(userId);
      const followMeIds = usersWhoFollowMe.map((u) => u.user_id);

      const { polls, count } = await getPolls(
        userId,
        user_id,
        followMeIds,
        page_size,
        page,
        query,
        getPollOrderByQuery(sort_by)
      );

      const total_pages = Math.ceil(count / page_size);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(page_size),
        total_pages: total_pages === 0 ? 1 : total_pages,
        total_results: parseInt(count),
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
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      if (
        (poll.sharing_option === 'private' && poll.user_id !== userId) ||
        (poll.sharing_option === 'followed_profiles' &&
          !(await isUserFollowing(poll.user_id, userId)))
      ) {
        return res.sendStatus(403);
      }

      if (poll.is_active) {
        const { content_types: contentTypes, content } = await getContentList(
          poll.content_list_id
        );

        poll.content_types = contentTypes;
        poll.content = content;
      }
      if (!poll.is_active) {
        const { total_votes: totalVotes, result } = await getPollResult(
          poll.id,
          poll.content_list_id
        );
        poll.total_votes = totalVotes;
        poll.result = result;
      }

      poll.content_list_sharing_option = (
        await knex
          .select('sharing_option')
          .from('content_lists')
          .where({ id: poll.content_list_id })
          .first()
      ).sharing_option;

      return res.json({
        id: poll.id,
        user_id: poll.user_id,
        user_name: poll.user_name,
        profile_image_url: poll.profile_image_url,
        title: poll.title,
        description: poll.description,
        sharing_option: poll.sharing_option,
        is_active: poll.is_active,
        thumbnail: poll.thumbnail,
        content_list_id: poll.content_list_id,
        content_list_sharing_option: poll.content_list_sharing_option,
        content_types: poll.content_types,
        content: poll.content,
        total_votes: poll.total_votes,
        result: poll.result,
        created_at: poll.created_at,
        updated_at: poll.updated_at,
      });
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
