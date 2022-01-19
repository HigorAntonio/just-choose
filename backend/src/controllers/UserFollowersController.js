const knex = require('../database');
const isUserFollowing = require('../utils/users/isUserFollowing');
const getUserFollowers = require('../utils/userFollowers/getUserFollowers');

module.exports = {
  async index(req, res) {
    try {
      const userId = req.userId;
      const profileId = req.params.id;

      const { page = 1, page_size: pageSize = 30 } = req.query;

      const errors = [];
      if (isNaN(profileId)) {
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
        return res.status(400).json({ erros: errors });
      }

      const profile = await knex
        .select()
        .from('users')
        .where({ id: profileId })
        .first();
      if (!profile) {
        return res.status(400).json({ erro: 'Perfil não encontrado' });
      }

      if (
        (profile.following_privacy === 'private' && profile.id !== userId) ||
        (profile.following_privacy === 'followed_profiles' &&
          !(await isUserFollowing(profile.id, userId)))
      ) {
        return res.json({
          page: parseInt(page),
          page_size: parseInt(pageSize),
          total_pages: 1,
          total_results: 0,
          results: [],
        });
      }

      const { followers, count } = await getUserFollowers({
        profileId,
        pageSize,
        page,
      });

      const totalPages = Math.ceil(count / pageSize);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(pageSize),
        total_pages: totalPages === 0 ? 1 : totalPages,
        total_results: parseInt(count),
        results: followers,
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const userId = req.userId;

      const followerId = req.params.id;

      if (isNaN(followerId)) {
        return res
          .status(400)
          .json({ erro: 'Id do perfil seguidor, valor inválido' });
      }

      const follower = await isUserFollowing(followerId, userId);

      return res.json({ follower });
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
