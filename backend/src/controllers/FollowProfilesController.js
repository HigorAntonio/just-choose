const knex = require('../database');
const logger = require('../lib/logger');

module.exports = {
  async create(req, res) {
    try {
      const profileId = req.profileId;

      const { followsId } = req.body;
      if (!followsId) {
        return res.status(400).json({ message: 'Id do usuário não informado' });
      }
      if (parseInt(profileId) === parseInt(followsId)) {
        return res.status(400).json({ message: 'Id do usuário inválido' });
      }

      const followsProfile = await knex
        .select()
        .from('profiles')
        .where({ id: followsId })
        .first();
      if (!followsProfile) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }

      const relationship = await knex
        .select()
        .from('follows_profiles')
        .where({
          profile_id: profileId,
          follows_id: followsId,
        })
        .first();
      if (relationship) {
        return res.status(400).json({ message: 'Relação existente' });
      }

      await knex('follows_profiles').insert({
        profile_id: profileId,
        follows_id: followsId,
      });

      return res.sendStatus(201);
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },

  async delete(req, res) {
    try {
      const profileId = req.profileId;

      const { followsId } = req.body;
      if (!followsId) {
        return res.status(400).json({ message: 'Id do usuário não informado' });
      }

      const relationship = await knex
        .select()
        .from('follows_profiles')
        .where({
          profile_id: profileId,
          follows_id: followsId,
        })
        .first();
      if (!relationship) {
        return res.status(400).json({ message: 'Relação não encontrada' });
      }

      await knex('follows_profiles').del().where({
        profile_id: profileId,
        follows_id: followsId,
      });

      return res.sendStatus(200);
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },
};
