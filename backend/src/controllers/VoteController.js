const knex = require('../database');
const isUserFollowing = require('../utils/users/isUserFollowing');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.userId;

      const { contentId, type } = req.body;
      const pollId = req.params.id;

      const errors = [];
      if (!contentId) {
        errors.push('Conteúdo a ser votado não informado');
      } else if (isNaN(contentId)) {
        errors.push('Conteúdo a ser votado, valor inválido');
      }
      if (!type) {
        errors.push('Tipo do conteúdo a ser votado não informado');
      } else if (typeof type !== 'string') {
        errors.push('Tipo do conteúdo a ser votado, valor inválido');
      }
      if (!pollId) {
        errors.push('Votação não informada');
      } else if (isNaN(pollId)) {
        errors.push('Votação, valor inválido');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const poll = await knex('polls').where({ id: pollId }).first();
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
      if (!poll.is_active) {
        return res.status(403).json({ erro: 'Votação desativada' });
      }

      const contentTypes = (
        await knex.select('name').from('content_types')
      ).map((type) => type.name);
      if (!contentTypes.includes(type)) {
        return res
          .status(400)
          .json({ erro: 'Tipo de conteúdo não encontrado' });
      }

      for (const name of contentTypes) {
        const vote = await knex(`${name}_votes`)
          .where({ user_id: userId, poll_id: pollId })
          .first();
        if (vote) {
          return res.status(403).json({ erro: 'Número de votos excedido' });
        }
      }

      const content = await knex
        .select()
        .from('poll_content_list')
        .where({ poll_id: pollId })
        .innerJoin(`content_list_${type}s`, function () {
          this.on(
            'poll_content_list.content_list_id',
            '=',
            `content_list_${type}s.content_list_id`
          ).andOn({ [`content_list_${type}s.${type}_id`]: contentId });
        })
        .first();
      if (!content) {
        return res.status(400).json({ erro: 'Conteúdo não encontrado' });
      }

      await knex(`${type}_votes`).insert({
        user_id: userId,
        [`${type}_id`]: contentId,
        poll_id: pollId,
      });

      return res.sendStatus(201);
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

      const poll = await knex('polls').where({ id: pollId }).first();
      if (!poll) {
        return res.status(400).json({ erro: 'Votação não encontrada' });
      }

      const contentTypes = (
        await knex.select('name').from('content_types')
      ).map((type) => type.name);

      let vote;
      for (const name of contentTypes) {
        platform = name === 'game' ? 'rawg' : 'tmdb';
        vote = await knex
          .select(
            'v.id',
            'v.user_id',
            `v.${name}_id as content_id`,
            `c.${platform}_id as content_platform_id`,
            knex.raw(`'${name}' as type`),
            'v.poll_id',
            'v.created_at',
            'v.updated_at'
          )
          .from(`${name}_votes as v`)
          .innerJoin(`${name}s as c`, 'c.id', `v.${name}_id`)
          .where({ 'v.user_id': userId, 'v.poll_id': pollId })
          .first();
        if (vote) {
          break;
        }
      }

      return res.json(vote);
    } catch (error) {
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

      const poll = await knex('polls').where({ id: pollId }).first();
      if (!poll) {
        return res.status(400).json({ erro: 'Votação não encontrada' });
      }
      if (!poll.is_active) {
        return res.status(403).json({ erro: 'Votação desativada' });
      }

      const contentTypes = (
        await knex.select('name').from('content_types')
      ).map((type) => type.name);

      let vote, contentType;
      for (const name of contentTypes) {
        contentType = name;
        vote = await knex(`${name}_votes`)
          .where({ user_id: userId, poll_id: pollId })
          .first();
        if (vote) {
          break;
        }
      }
      if (!vote) {
        return res.status(400).json({ erro: 'Voto não encontrado' });
      }

      await knex(`${contentType}_votes`)
        .del()
        .where({ user_id: userId, poll_id: pollId });

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
