const knex = require('../database');
const deleteFile = require('../utils/deleteFile');
const getProfiles = require('../utils/profiles/getProfiles');
const getProfileOrderByQuery = require('../utils/profiles/getProfileOrderByQuery');
const getProfile = require('../utils/profiles/getProfile');
const logger = require('../lib/logger');

module.exports = {
  async index(req, res) {
    try {
      const {
        query,
        exact_name: exactName,
        page = 1,
        page_size: pageSize = 30,
        sort_by: sortBy = 'name.asc',
      } = req.query;

      const errors = [];
      if (query && typeof query !== 'string') {
        errors.push({ erro: 'O parâmetro query deve ser uma string' });
      }
      if (exactName && typeof exactName !== 'string') {
        errors.push({ erro: 'O parâmetro exact_name deve ser uma string' });
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
      if (sortBy) {
        if (typeof sortBy !== 'string') {
          errors.push('O parâmetro sort_by deve ser uma string');
        } else if (!getProfileOrderByQuery(sortBy)) {
          errors.push('Parâmetro sort_by, valor inválido');
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const { profiles, count } = await getProfiles({
        pageSize,
        page,
        query,
        exactName,
        sortBy: getProfileOrderByQuery(sortBy),
      });

      const totalPages = Math.ceil(count / pageSize);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(pageSize),
        total_pages: totalPages === 0 ? 1 : totalPages,
        total_results: count,
        results: profiles,
      });
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const profileId = req.profileId;

      const profileToShowId = parseInt(req.params.id);

      if (isNaN(profileToShowId)) {
        return res
          .status(400)
          .json({ erro: 'Id do perfil de usuário, valor inválido' });
      }

      const profile = await getProfile(profileToShowId);

      if (!profile) {
        return res
          .status(400)
          .json({ erro: 'Perfil de usuário não encontrado' });
      }

      if (profileId !== profileToShowId) {
        delete profile.email;
        delete profile.method;
        delete profile.is_active;
      }

      return res.json(profile);
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },

  async update(req, res) {
    try {
      const profileId = req.profileId;

      if (isNaN(profileId)) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erro: 'Id do usuário, valor inválido' });
      }

      const profile = await knex
        .select()
        .from('profiles as p')
        .where({ id: profileId })
        .first();

      if (!profile) {
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
      const {
        name = profile.name,
        following_privacy: followingPrivacy = profile.following_privacy,
      } = dataObj;
      const errors = [];

      if (!name) {
        errors.push('Nome do usuário não informado');
      } else if (typeof name !== 'string') {
        errors.push('Nome do usuário, valor inválido');
      }
      if (
        followingPrivacy !== 'private' &&
        followingPrivacy !== 'public' &&
        followingPrivacy !== 'followed_profiles'
      ) {
        errors.push(
          'Opção de privacidade das listas de perfis seguidos e de seguidores, valor inválido'
        );
      }
      if (errors.length > 0) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erros: errors });
      }

      if (dataObj.name) {
        const profileWithSameName = await knex
          .select()
          .from('profiles as p')
          .where({ 'p.name': name })
          .first();

        if (profileWithSameName) {
          try {
            await deleteFile(req.file.key);
          } catch (error) {}
          return res.status(400).json({ erro: 'Nome de usuário indisponível' });
        }
      }

      const deleteOldProfileImage = req.file ? true : false;
      const profileImageUrl = req.file
        ? `${process.env.APP_URL}/files/${req.file.key}`
        : profile.profile_image_url;

      await knex('profiles')
        .update({
          name,
          profile_image_url: profileImageUrl,
          following_privacy: followingPrivacy,
        })
        .where({ id: profileId });

      if (deleteOldProfileImage) {
        if (profile.profile_image_url) {
          await deleteFile(
            profile.profile_image_url.substring(
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
      logger.error(error);
      return res.sendStatus(500);
    }
  },
};
