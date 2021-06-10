const knex = require('../database');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.userId;

      const contentListId = req.params.id;
      if (!contentListId) {
        return res
          .status(400)
          .json({ erro: 'Id da lista de conteúdo não informado' });
      }
      if (isNaN(contentListId)) {
        return res
          .status(400)
          .json({ erro: 'Id da lista de conteúdo valor inválido' });
      }

      const contentList = await knex
        .select()
        .from('content_lists')
        .where({ id: contentListId })
        .first();

      if (!contentList) {
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      const like = await knex
        .select()
        .from('content_list_likes')
        .where({ content_list_id: contentListId, user_id: userId })
        .first();
      if (like) {
        return res.status(403).json({ erro: 'Like existente' });
      }

      await knex('content_list_likes').insert({
        content_list_id: contentListId,
        user_id: userId,
      });

      return res.sendStatus(201);
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const userId = req.userId;

      const contentListId = req.params.id;
      if (!contentListId) {
        return res
          .status(400)
          .json({ erro: 'Id da lista de conteúdo não informado' });
      }
      if (isNaN(contentListId)) {
        return res
          .status(400)
          .json({ erro: 'Id da lista de conteúdo valor inválido' });
      }

      const contentList = await knex
        .select()
        .from('content_lists')
        .where({ id: contentListId })
        .first();

      if (!contentList) {
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      const like = await knex
        .select()
        .from('content_list_likes')
        .where({ content_list_id: contentListId, user_id: userId })
        .first();

      return res.json({ like: !!like });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async delete(req, res) {
    try {
      const userId = req.userId;

      const contentListId = req.params.id;
      if (!contentListId) {
        return res
          .status(400)
          .json({ erro: 'Id da lista de conteúdo não informado' });
      }
      if (isNaN(contentListId)) {
        return res
          .status(400)
          .json({ erro: 'Id da lista de conteúdo valor inválido' });
      }

      const contentList = await knex
        .select()
        .from('content_lists')
        .where({ id: contentListId })
        .first();

      if (!contentList) {
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      const like = await knex
        .select()
        .from('content_list_likes')
        .where({ content_list_id: contentListId, user_id: userId })
        .first();
      if (!like) {
        return res.status(400).json({ erro: 'Like não encontrado' });
      }

      await knex('content_list_likes').del().where({
        content_list_id: contentListId,
        user_id: userId,
      });

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
