const knex = require('../database');
const deleteFile = require('../utils/deleteFile');
const createContentList = require('../utils/contentList/createContentList');
const updateContentList = require('../utils/contentList/updateContentList');
const getProfileFollowersIds = require('../utils/profileFollowers/getProfileFollowersIds');
const isProfileFollowing = require('../utils/profiles/isProfileFollowing');
const getContentLists = require('../utils/contentList/getContentLists');
const getListOrderByQuery = require('../utils/contentList/getListOrderByQuery');
const getContentList = require('../utils/contentList/getContentList');
const deleteContentList = require('../utils/contentList/deleteContentList');
const logger = require('../lib/logger');

module.exports = {
  async create(req, res) {
    try {
      const profileId = req.profileId;

      const { data } = req.body;
      if (!data) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erro: 'Dados da lista não informados' });
      }

      const {
        title,
        description,
        sharingOption = 'private',
        content,
      } = JSON.parse(data);
      const errors = [];

      if (!title) {
        errors.push('Título da lista não informado');
      } else if (typeof title !== 'string') {
        errors.push('Título da lista, valor inválido');
      } else if (title && title.length > 100) {
        errors.push('O campo title deve ter no máximo 100 caracteres');
      }
      if (description && typeof description !== 'string') {
        errors.push('Descrição da lista, valor inválido');
      } else if (description && description.length > 1000) {
        errors.push('O campo description deve no máximo 1000 caracteres');
      }
      if (
        typeof sharingOption !== 'undefined' &&
        sharingOption !== 'private' &&
        sharingOption !== 'public' &&
        sharingOption !== 'followed_profiles'
      ) {
        errors.push('Opção de compartilhamento da lista, valor inválido');
      }
      if (!req.file) {
        errors.push('Thumbnail da lista não informada');
      }
      if (!content) {
        errors.push('Conteúdo da lista não informado');
      } else if (!Array.isArray(content)) {
        errors.push('Conteúdo da lista, valor inválido');
      } else if (content.length < 1 || content.length > 100) {
        errors.push(
          'Conteúdo da lista inválido. O número de itens deve ficar entre 1 e 100'
        );
      }
      if (errors.length > 0) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erros: errors });
      }

      const thumbnail = `${process.env.APP_URL}/files/${req.file.key}`;

      const contentListId = await createContentList({
        profileId,
        title,
        description,
        sharingOption,
        thumbnail,
        content,
      });

      return res.status(201).json({ id: contentListId });
    } catch (error) {
      try {
        await deleteFile(req.file.key);
      } catch (error) {}
      logger.error(error);
      return res.sendStatus(500);
    }
  },

  async index(req, res) {
    try {
      const authProfileId = req.profileId;

      const {
        profile_id: reqProfileId,
        query,
        page = 1,
        page_size: pageSize = 30,
        sort_by: sortBy = 'updated.desc',
      } = req.query;

      const errors = [];

      if (reqProfileId && isNaN(reqProfileId)) {
        errors.push('O parâmetro profile_id deve ser um número');
      } else if (reqProfileId) {
        const profile = await knex('profiles')
          .where({ id: reqProfileId })
          .first();
        if (!profile) {
          errors.push('Usuário não encontrado');
        }
      }
      if (query && typeof query !== 'string') {
        errors.push({ erro: 'O parâmetro query deve ser uma string' });
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
        } else if (!getListOrderByQuery(sortBy)) {
          errors.push('Parâmetro sort_by, valor inválido');
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const followersIds = await getProfileFollowersIds(authProfileId);

      const { contentLists, count } = await getContentLists({
        profileId: reqProfileId,
        getPrivate: parseInt(authProfileId) === parseInt(reqProfileId),
        followersIds,
        pageSize,
        page,
        query,
        sortBy: getListOrderByQuery(sortBy),
      });

      const totalPages = Math.ceil(count / pageSize);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(pageSize),
        total_pages: totalPages === 0 ? 1 : totalPages,
        total_results: count,
        results: contentLists,
      });
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const profileId = req.profileId;

      const contentListId = req.params.id;

      if (isNaN(contentListId)) {
        return res
          .status(400)
          .json({ erro: 'Id da lista de conteúdo, valor inválido' });
      }

      const contentList = await getContentList(contentListId);

      if (!contentList) {
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      if (
        (contentList.sharing_option === 'private' &&
          contentList.profile_id !== profileId) ||
        (contentList.sharing_option === 'followed_profiles' &&
          !(await isProfileFollowing(contentList.profile_id, profileId)))
      ) {
        return res.sendStatus(403);
      }

      return res.json(contentList);
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },

  async update(req, res) {
    try {
      const profileId = req.profileId;

      const contentListId = req.params.id;

      if (isNaN(contentListId)) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res
          .status(400)
          .json({ erro: 'Id da lista de conteúdo, valor inválido' });
      }

      const contentList = await knex('content_lists')
        .where({
          id: contentListId,
        })
        .first();

      if (!contentList) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      if (contentList.profile_id !== profileId) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(403).json({ erro: 'Usuário inválido' });
      }

      const { data } = req.body;
      if (!data) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erro: 'Dados da lista não informados' });
      }

      const {
        title = contentList.title,
        description = contentList.description,
        sharingOption = contentList.sharing_option,
        content,
      } = JSON.parse(data);
      const errors = [];

      if (!title) {
        errors.push('Título da lista não informado');
      } else if (typeof title !== 'string') {
        errors.push('Título da lista, valor inválido');
      } else if (title && title.length > 100) {
        errors.push('O campo title deve ter no máximo 100 caracteres');
      }
      if (description && typeof description !== 'string') {
        errors.push('Descrição da lista, valor inválido');
      } else if (description && description.length > 1000) {
        errors.push('O campo description deve ter no máximo 1000 caracteres');
      }
      if (
        sharingOption !== 'private' &&
        sharingOption !== 'public' &&
        sharingOption !== 'followed_profiles'
      ) {
        errors.push('Opção de compartilhamento da lista, valor inválido');
      }
      if (content && !Array.isArray(content)) {
        errors.push('Conteúdo da lista, valor inválido');
      } else if (content && (content.length < 1 || content.length > 100)) {
        errors.push(
          'Conteúdo da lista inválido. O número de itens deve ficar entre 1 e 100'
        );
      }
      if (errors.length > 0) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erros: errors });
      }

      const deleteOldThumbnail = req.file ? true : false;
      const thumbnail = req.file
        ? `${process.env.APP_URL}/files/${req.file.key}`
        : contentList.thumbnail;

      await updateContentList({
        contentListId,
        title,
        description,
        sharingOption,
        thumbnail,
        content,
      });

      if (deleteOldThumbnail) {
        await deleteFile(
          contentList.thumbnail.substring(
            `${process.env.APP_URL}/files/`.length
          )
        );
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

  async delete(req, res) {
    try {
      const profileId = req.profileId;

      const contentListId = req.params.id;

      if (isNaN(contentListId)) {
        return res
          .status(400)
          .json({ erro: 'Id da lista de conteúdo, valor inválido' });
      }

      const contentList = await knex('content_lists')
        .where({
          id: contentListId,
        })
        .first();

      if (!contentList) {
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      if (contentList.profile_id !== profileId) {
        return res.status(403).json({ erro: 'Usuário inválido' });
      }

      await deleteContentList(contentListId);

      await deleteFile(
        contentList.thumbnail.substring(`${process.env.APP_URL}/files/`.length)
      );

      return res.sendStatus(200);
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },
};
