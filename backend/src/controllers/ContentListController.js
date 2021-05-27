const knex = require('../database');
const deleteFile = require('../utils/deleteFile');
const createContentListOnDB = require('../utils/contentList/createContentListOnDB');
const updateContentListOnDB = require('../utils/contentList/updateContentListOnDB');
const getFollowingUsers = require('../utils/users/getFollowingUsers');
const isUserFollowing = require('../utils/users/isUserFollowing');
const getContentLists = require('../utils/contentList/getContentLists');
const getListOrderByQuery = require('../utils/contentList/getListOrderByQuery');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.userId;

      if (!userId) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.sendStatus(401);
      }

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
      }
      if (description && typeof description !== 'string') {
        errors.push('Descrição da lista, valor inválido');
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

      await createContentListOnDB(
        userId,
        title,
        description,
        sharingOption,
        thumbnail,
        content
      );

      return res.sendStatus(201);
    } catch (error) {
      try {
        await deleteFile(req.file.key);
      } catch (error) {}
      return res.sendStatus(500);
    }
  },

  async index(req, res) {
    try {
      const userId = req.userId;

      const {
        user_id,
        page = 1,
        page_size = 30,
        sort_by = 'updated.desc',
      } = req.query;

      const errors = [];

      if (user_id && isNaN(user_id)) {
        errors.push('O parâmetro user_id deve ser um número');
      } else if (user_id) {
        const user = await knex('users').where({ id: user_id }).first();
        if (!user) {
          errors.push('Usuário não encontrado');
        }
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
        } else if (!getListOrderByQuery(sort_by)) {
          errors.push('Parâmetro sort_by, valor inválido');
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const usersWhoFollowMe = await getFollowingUsers(userId);
      const followMeIds = usersWhoFollowMe.map((u) => u.user_id);

      const { contentLists, count } = await getContentLists(
        userId,
        user_id,
        followMeIds,
        page_size,
        page,
        getListOrderByQuery(sort_by)
      );

      const total_pages = Math.ceil(count / page_size);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(page_size),
        total_pages: total_pages === 0 ? 1 : total_pages,
        total_results: parseInt(count),
        items: contentLists.map((list) => ({
          id: list.id,
          user_id: list.user_id,
          user_name: list.user_name,
          title: list.title,
          description: list.description,
          sharing_option: list.sharing_option,
          thumbnail: list.thumbnail,
          likes: parseInt(list.likes),
          forks: parseInt(list.forks),
          content_types: list.content_types,
          created_at: list.created_at,
          updated_at: list.updated_at,
        })),
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const userId = req.userId;

      const contentListId = req.params.id;

      if (isNaN(contentListId)) {
        return res.sendStatus(404);
      }

      const contentList = await knex
        .select(
          'cl.id',
          'cl.user_id',
          'users.name as user_name',
          'cl.title',
          'cl.description',
          'cl.sharing_option',
          'cl.thumbnail',
          'content_types',
          knex.raw(
            `JSON_BUILD_OBJECT(` +
              `'movies', movies, 'shows', shows, 'games', games) ` +
              `AS content`
          ),
          knex.raw('COALESCE(likes, 0) AS likes'),
          knex.raw('COALESCE(forks, 0) AS forks'),
          'cl.created_at',
          'cl.updated_at'
        )
        .from('content_lists as cl')
        .where({
          'cl.id': contentListId,
        })
        .innerJoin('users', 'cl.user_id', 'users.id')
        .leftJoin(
          knex
            .select(
              'content_list_id as list_id',
              knex.raw('ARRAY_AGG(ct.name) AS content_types')
            )
            .from('content_list_types')
            .innerJoin('content_types as ct', 'content_type_id', 'ct.id')
            .groupBy('list_id')
            .as('clt'),
          'clt.list_id',
          'cl.id'
        )
        .leftJoin(
          knex
            .select('content_list_id as list_id', knex.raw('COUNT(*) AS likes'))
            .from('content_list_likes')
            .groupBy('list_id')
            .as('cll'),
          'cll.list_id',
          'cl.id'
        )
        .leftJoin(
          knex
            .select(
              'original_list_id as list_id',
              knex.raw('COUNT(*) AS forks')
            )
            .from('content_list_forks')
            .groupBy('list_id')
            .as('clf'),
          'clf.list_id',
          'cl.id'
        )
        .innerJoin(
          knex
            .select(
              'id',
              knex.raw(
                `COALESCE(JSON_AGG(JSON_BUILD_OBJECT(` +
                  `'content_id', mc.content_id, ` +
                  `'content_platform_id', mc.content_platform_id, ` +
                  `'title', mc.title, ` +
                  `'poster_path', mc.poster_path, ` +
                  `'type', mc.type)) ` +
                  `FILTER (WHERE mc IS NOT NULL), '[]'::json) AS movies`
              )
            )
            .from('content_lists as cls')
            .leftJoin(
              knex
                .select(
                  'content_list_id',
                  'movie_id as content_id',
                  'tmdb_id as content_platform_id',
                  'title',
                  'poster_path',
                  knex.raw(`'movie' AS type`)
                )
                .from('content_list_movies as clm')
                .innerJoin('movies as m', 'clm.movie_id', 'm.id')
                .as('mc'),
              'cls.id',
              'mc.content_list_id'
            )
            .groupBy('cls.id')
            .as('mq'),
          'mq.id',
          'cl.id'
        )
        .innerJoin(
          knex
            .select(
              'id',
              knex.raw(
                `COALESCE(JSON_AGG(JSON_BUILD_OBJECT(` +
                  `'content_id', sc.content_id, ` +
                  `'content_platform_id', sc.content_platform_id, ` +
                  `'title', sc.title, ` +
                  `'poster_path', sc.poster_path, ` +
                  `'type', sc.type)) ` +
                  `FILTER (WHERE sc IS NOT NULL), '[]'::json) AS shows`
              )
            )
            .from('content_lists as cls')
            .leftJoin(
              knex
                .select(
                  'content_list_id',
                  'show_id as content_id',
                  'tmdb_id as content_platform_id',
                  'name as title',
                  'poster_path',
                  knex.raw(`'show' AS type`)
                )
                .from('content_list_shows as cls')
                .innerJoin('shows as s', 'cls.show_id', 's.id')
                .as('sc'),
              'cls.id',
              'sc.content_list_id'
            )
            .groupBy('cls.id')
            .as('sq'),
          'sq.id',
          'cl.id'
        )
        .innerJoin(
          knex
            .select(
              'id',
              knex.raw(
                `COALESCE(JSON_AGG(JSON_BUILD_OBJECT(` +
                  `'content_id', gc.content_id, ` +
                  `'content_platform_id', gc.content_platform_id, ` +
                  `'title', gc.title, ` +
                  `'poster_path', gc.poster_path, ` +
                  `'type', gc.type)) ` +
                  `FILTER (WHERE gc IS NOT NULL), '[]'::json) AS games`
              )
            )
            .from('content_lists as cls')
            .leftJoin(
              knex
                .select(
                  'content_list_id',
                  'game_id as content_id',
                  'rawg_id as content_platform_id',
                  'name as title',
                  'background_image as poster_path',
                  knex.raw(`'game' AS type`)
                )
                .from('content_list_games as clg')
                .innerJoin('games as g', 'clg.game_id', 'g.id')
                .as('gc'),
              'cls.id',
              'gc.content_list_id'
            )
            .groupBy('cls.id')
            .as('gq'),
          'gq.id',
          'cl.id'
        )
        .first();

      Object.keys(contentList.content).map((type) => {
        if (!contentList.content[type].length) {
          delete contentList.content[type];
        }
      });

      if (!contentList) {
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      if (
        (contentList.sharing_option === 'private' &&
          contentList.user_id !== userId) ||
        (contentList.sharing_option === 'followed_profiles' &&
          !(await isUserFollowing(contentList.user_id, userId)))
      ) {
        return res.sendStatus(401);
      }

      return res.json({
        id: contentList.id,
        user_id: contentList.user_id,
        user_name: contentList.user_name,
        title: contentList.title,
        description: contentList.description,
        sharing_option: contentList.sharing_option,
        thumbnail: contentList.thumbnail,
        likes: parseInt(contentList.likes),
        forks: parseInt(contentList.forks),
        content_types: contentList.content_types,
        content: contentList.content,
        created_at: contentList.created_at,
        updated_at: contentList.updated_at,
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async update(req, res) {
    try {
      const userId = req.userId;

      if (!userId) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.sendStatus(401);
      }

      const contentListId = req.params.id;

      if (isNaN(contentListId)) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.sendStatus(404);
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

      if (contentList.user_id !== userId) {
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
      }
      if (description && typeof description !== 'string') {
        errors.push('Descrição da lista, valor inválido');
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

      await updateContentListOnDB(
        contentListId,
        title,
        description,
        sharingOption,
        thumbnail,
        content
      );

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
      return res.sendStatus(500);
    }
  },

  async delete(req, res) {
    try {
      const userId = req.userId;

      if (!userId) return res.sendStatus(401);

      const contentListId = req.params.id;

      if (isNaN(contentListId)) {
        return res.sendStatus(404);
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

      if (contentList.user_id !== userId) {
        return res.status(403).json({ erro: 'Usuário inválido' });
      }

      await knex('content_lists').del().where({ id: contentListId });

      await deleteFile(
        contentList.thumbnail.substring(`${process.env.APP_URL}/files/`.length)
      );

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
