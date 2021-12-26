const knex = require('../database');
const isUserFollowing = require('../utils/users/isUserFollowing');
const getUserFollowing = require('../utils/userFollowing/getUserFollowing');

module.exports = {
  async index(req, res) {
    try {
      const userId = req.userId;
      const profileId = req.params.id;

      const { page = 1, page_size = 30 } = req.query;

      const errors = [];
      if (isNaN(profileId)) {
        errors.push('Id do perfil, valor inválido');
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
        return res.sendStatus(403);
      }

      const { following, count } = await getUserFollowing(
        profileId,
        page_size,
        page
      );

      const total_pages = Math.ceil(count / page_size);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(page_size),
        total_pages: total_pages === 0 ? 1 : total_pages,
        total_results: parseInt(count),
        results: following.map((user) => ({
          user_id: user.id,
          user_name: user.name,
          profile_image_url: user.profile_image_url,
          followers_count: parseInt(user.followers_count),
          following_count: parseInt(user.following_count),
          created_at: user.created_at,
          updated_at: user.updated_at,
        })),
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const userId = req.userId;

      const followsId = req.params.id;

      if (isNaN(followsId)) {
        return res
          .status(400)
          .json({ erro: 'Id do perfil seguido, valor inválido' });
      }

      const following = await isUserFollowing(userId, followsId);

      return res.json({ following });
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
