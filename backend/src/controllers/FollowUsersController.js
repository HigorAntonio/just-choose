const knex = require('../database');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.sendStatus(401);
      }

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

  async index(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.sendStatus(401);
      }

      const { page = 1, page_size = 30 } = req.query;

      const errors = [];
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

      const followedUsers = await knex
        .select(
          'u.id',
          'u.name',
          'u.profile_image_url',
          'fu.created_at',
          'fu.updated_at'
        )
        .from('follows_users as fu')
        .innerJoin('users as u', function () {
          this.on('fu.follows_id', '=', 'u.id').andOn({
            ['fu.user_id']: userId,
          });
        })
        .limit(page_size)
        .offset((page - 1) * page_size)
        .orderBy('u.name');

      const [{ count }] = await knex('follows_users')
        .count()
        .where({ user_id: userId });

      const total_pages = Math.ceil(count / page_size);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(page_size),
        total_pages: total_pages === 0 ? 1 : total_pages,
        total_results: parseInt(count),
        items: followedUsers.map((user) => ({
          user_id: user.id,
          user_name: user.name,
          profile_image_url: user.profile_image_url,
        })),
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },

  async delete(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.sendStatus(401);
      }

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
