const knex = require('../database');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.userId;

      const { followsId } = req.body;
      if (!followsId) {
        return res.status(400).json({ erro: 'Id do usuário não informado' });
      }
      if (userId === followsId) {
        return res.status(400).json({ erro: 'Id do usuário inválido' });
      }

      const followsUser = await knex
        .select()
        .from('users')
        .where({ id: followsId })
        .first();
      if (!followsUser) {
        return res.status(400).json({ erro: 'Usuário não encontrado' });
      }

      const relationship = await knex
        .select()
        .from('follows_users')
        .where({
          user_id: userId,
          follows_id: followsId,
        })
        .first();
      if (relationship) {
        return res.status(400).json({ erro: 'Relação existente' });
      }

      await knex('follows_users').insert({
        user_id: userId,
        follows_id: followsId,
      });

      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },

  async delete(req, res) {
    try {
      const userId = req.userId;

      const { followsId } = req.body;
      if (!followsId) {
        return res.status(400).json({ erro: 'Id do usuário não informado' });
      }

      const relationship = await knex
        .select()
        .from('follows_users')
        .where({
          user_id: userId,
          follows_id: followsId,
        })
        .first();
      if (!relationship) {
        return res.status(400).json({ erro: 'Relação não encontrada' });
      }

      await knex('follows_users').del().where({
        user_id: userId,
        follows_id: followsId,
      });

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
