const knex = require('../database');
const deleteFile = require('../utils/deleteFile');
const getUsers = require('../utils/users/getUsers');
const getUserOrderByQuery = require('../utils/users/getUserOrderByQuery');

module.exports = {
  async index(req, res) {
    try {
      const {
        query,
        exact_name,
        page = 1,
        page_size = 30,
        sort_by = 'name.asc',
      } = req.query;

      const errors = [];
      if (query && typeof query !== 'string') {
        errors.push({ erro: 'O parâmetro query deve ser uma string' });
      }
      if (exact_name && typeof exact_name !== 'string') {
        errors.push({ erro: 'O parâmetro exact_name deve ser uma string' });
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
        } else if (!getUserOrderByQuery(sort_by)) {
          errors.push('Parâmetro sort_by, valor inválido');
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const { users, count } = await getUsers(
        page_size,
        page,
        query,
        exact_name,
        getUserOrderByQuery(sort_by)
      );

      const total_pages = Math.ceil(count / page_size);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(page_size),
        total_pages: total_pages === 0 ? 1 : total_pages,
        total_results: parseInt(count),
        results: users.map((user) => ({
          id: user.id,
          name: user.name,
          profile_image_url: user.profile_image_url,
          followers_count: parseInt(user.followers_count),
          following_count: parseInt(user.following_count),
        })),
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const userId = req.userId;

      const profileId = parseInt(req.params.id);

      if (isNaN(profileId)) {
        return res
          .status(400)
          .json({ erro: 'Id do perfil de usuário, valor inválido' });
      }

      const profile = await knex
        .select(
          'id',
          'name',
          'email',
          'profile_image_url',
          'method',
          'is_active'
        )
        .from('users as u')
        .where({ 'u.id': profileId })
        .first();

      if (!profile) {
        return res
          .status(400)
          .json({ erro: 'Perfil de usuário não encontrado' });
      }

      if (userId !== profileId) {
        delete profile.email;
        delete profile.method;
        delete profile.is_active;
      }

      return res.json(profile);
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async update(req, res) {
    try {
      const userId = req.userId;

      if (isNaN(userId)) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erro: 'Id do usuário, valor inválido' });
      }

      const user = await knex
        .select()
        .from('users as u')
        .where({ id: userId })
        .first();

      if (!user) {
        return res.status(400).json({ erro: 'Usuário não encontrado' });
      }

      const { data } = req.body;
      if (!data) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res
          .status(400)
          .json({ erro: 'Dados do usuário não informados' });
      }

      const dataObj = JSON.parse(data);
      const { name = user.name } = dataObj;
      const errors = [];

      if (!name) {
        errors.push('Nome do usuário não informado');
      } else if (typeof name !== 'string') {
        errors.push('Nome do usuário, valor inválido');
      }
      if (errors.length > 0) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erros: errors });
      }

      if (dataObj.name) {
        const userWithSameName = await knex
          .select()
          .from('users as u')
          .where({ 'u.name': name })
          .first();

        if (userWithSameName) {
          try {
            await deleteFile(req.file.key);
          } catch (error) {}
          return res.status(400).json({ erro: 'Nome de usuário indisponível' });
        }
      }

      const deleteOldProfileImage = req.file ? true : false;
      const profileImageUrl = req.file
        ? `${process.env.APP_URL}/files/${req.file.key}`
        : user.profile_image_url;

      await knex('users')
        .update({ name, profile_image_url: profileImageUrl })
        .where({ id: userId });

      if (deleteOldProfileImage) {
        if (user.profile_image_url) {
          await deleteFile(
            user.profile_image_url.substring(
              `${process.env.APP_URL}/files/`.length
            )
          );
        }
      }

      return res.sendStatus(200);
    } catch (error) {
      try {
        await deleteFile(req.file.key);
      } catch (error) {}
      return res.sendStatus(500);
    }
  },
};
