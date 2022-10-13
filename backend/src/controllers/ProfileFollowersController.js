const knex = require('../database');
const isProfileFollowing = require('../utils/profiles/isProfileFollowing');
const getProfileFollowers = require('../utils/profileFollowers/getProfileFollowers');
const logger = require('../lib/logger');

module.exports = {
  async index(req, res) {
    try {
      const profileId = req.profileId;
      const profileToShowId = req.params.id;

      const { page = 1, page_size: pageSize = 30 } = req.query;

      const errors = [];
      if (isNaN(profileToShowId)) {
        errors.push('Id do perfil, valor inválido');
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
      if (errors.length > 0) {
        return res.status(400).json({ messages: errors });
      }

      const profile = await knex
        .select()
        .from('profiles')
        .where({ id: profileToShowId })
        .first();
      if (!profile) {
        return res.status(400).json({ message: 'Perfil não encontrado' });
      }

      if (
        (profile.following_privacy === 'private' && profile.id !== profileId) ||
        (profile.following_privacy === 'followed_profiles' &&
          !(await isProfileFollowing(profile.id, profileId)))
      ) {
        return res.json({
          page: parseInt(page),
          page_size: parseInt(pageSize),
          total_pages: 1,
          total_results: 0,
          results: [],
        });
      }

      const { followers, count } = await getProfileFollowers({
        profileToShowId,
        pageSize,
        page,
      });

      const totalPages = Math.ceil(count / pageSize);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(pageSize),
        total_pages: totalPages === 0 ? 1 : totalPages,
        total_results: count,
        results: followers,
      });
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const profileId = req.profileId;

      const followerId = req.params.id;

      if (isNaN(followerId)) {
        return res
          .status(400)
          .json({ message: 'Id do perfil seguidor, valor inválido' });
      }

      const follower = await isProfileFollowing(followerId, profileId);

      return res.json({ follower });
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },
};
