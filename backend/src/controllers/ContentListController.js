const knex = require('../database');
const deleteFile = require('../utils/deleteFile');

const getPlatformId = (contentType) => {
  if (contentType === 'movie') {
    return 'tmdb_id';
  }
  if (contentType === 'show') {
    return 'tmdb_id';
  }
  if (contentType === 'game') {
    return 'rawg_id';
  }
};

const sanitizeListData = async (content_list) => {
  try {
    const contentNames = [
      ...new Set(content_list.map((content) => content.type)),
    ];
    const contentTypes = await knex('content_types')
      .select('id', 'name')
      .whereIn('name', contentNames);

    const contentToInsert = {};
    contentNames.forEach(
      (name) => (contentToInsert[`content_list_${name}s`] = [])
    );
    for (const content of content_list) {
      contentToInsert[`content_list_${content.type}s`].push(content.contentId);
    }

    // Removendo ids duplicados e ids de conteúdos que não existem no banco de dados
    for (const type of contentTypes) {
      let platformId = getPlatformId(type.name);
      contentToInsert[`content_list_${type.name}s`] = (
        await knex
          .select('id')
          .from(`${type.name}s`)
          .whereIn(platformId, contentToInsert[`content_list_${type.name}s`])
      ).map((content) => content.id);
    }

    return [contentTypes, contentToInsert];
  } catch (error) {
    throw error;
  }
};

const createContentListOnDB = async (
  userId,
  title,
  description,
  thumbnail,
  content_list
) => {
  try {
    const [contentTypes, contentToInsert] = await sanitizeListData(
      content_list
    );

    await knex.transaction(async (trx) => {
      const [{ id: contentListId }] = await trx('content_lists')
        .insert({ user_id: userId, title, description, thumbnail })
        .returning(['id']);

      await trx('content_list_types').insert(
        contentTypes.map((contentType) => ({
          content_list_id: contentListId,
          content_type_id: contentType.id,
        }))
      );

      for (const contentType of contentTypes) {
        await trx(`content_list_${contentType.name}s`).insert(
          contentToInsert[`content_list_${contentType.name}s`].map(
            (contentId) => ({
              content_list_id: contentListId,
              [`${contentType.name}_id`]: contentId,
            })
          )
        );
      }
    });
  } catch (error) {
    throw error;
  }
};

const updateContentListOnDB = async (
  contentListId,
  title,
  description,
  thumbnail,
  content_list
) => {
  try {
    const [contentTypes, contentToInsert] = await sanitizeListData(
      content_list
    );

    await knex.transaction(async (trx) => {
      await trx('content_lists')
        .update({ title, description, thumbnail })
        .where({ id: contentListId });

      const oldContentTypes = await trx
        .select('ct.name')
        .from('content_list_types as clt')
        .where({
          content_list_id: contentListId,
        })
        .innerJoin('content_types as ct', 'clt.content_type_id', 'ct.id');

      await trx('content_list_types')
        .del()
        .where({ content_list_id: contentListId });

      await trx('content_list_types').insert(
        contentTypes.map((contentType) => ({
          content_list_id: contentListId,
          content_type_id: contentType.id,
        }))
      );

      for (const contentType of oldContentTypes) {
        await trx(`content_list_${contentType.name}s`)
          .del()
          .where({ content_list_id: contentListId });
      }

      for (const contentType of contentTypes) {
        await trx(`content_list_${contentType.name}s`).insert(
          contentToInsert[`content_list_${contentType.name}s`].map(
            (contentId) => ({
              content_list_id: contentListId,
              [`${contentType.name}_id`]: contentId,
            })
          )
        );
      }
    });
  } catch (error) {
    throw error;
  }
};

const getContentLists = async (followMeIds, page_size, page) => {
  try {
    const contentLists = await knex
      .select()
      .from(function () {
        this.select(
          'cl.id',
          'cl.user_id',
          'u.name as user_name',
          'cl.title',
          'cl.description',
          'cl.sharing_option',
          'cl.thumbnail',
          'cl.created_at',
          'cl.updated_at'
        )
          .from('content_lists as cl')
          .where({ sharing_option: 'public' })
          .innerJoin('users as u', 'cl.user_id', 'u.id')
          .union(function () {
            this.select(
              'cl.id',
              'cl.user_id',
              'u.name as user_name',
              'cl.title',
              'cl.description',
              'cl.sharing_option',
              'cl.thumbnail',
              'cl.created_at',
              'cl.updated_at'
            )
              .from('content_lists as cl')
              .where({ sharing_option: 'followed_profiles' })
              .innerJoin('users as u', 'cl.user_id', 'u.id')
              .whereIn('u.id', followMeIds);
          })
          .as('clsq');
      })
      .limit(page_size)
      .offset((page - 1) * page_size)
      .orderBy('updated_at', 'desc');

    const [{ count }] = await knex.count().from(function () {
      this.select()
        .from(function () {
          this.select('cl.id', 'cl.user_id')
            .from('content_lists as cl')
            .where({ sharing_option: 'public' })
            .as('public_lists');
        })
        .union(function () {
          this.select('cl.id', 'cl.user_id')
            .from('content_lists as cl')
            .where({ sharing_option: 'followed_profiles' })
            .whereIn('cl.user_id', followMeIds);
        })
        .as('count_query');
    });

    return { contentLists, count };
  } catch (error) {
    throw error;
  }
};

const getUsersContentLists = async (
  userId,
  user_id,
  followMeIds,
  page_size,
  page
) => {
  try {
    const contentLists = await knex
      .select()
      .from(function () {
        this.select(
          'cl.id',
          'cl.user_id',
          'u.name as user_name',
          'cl.title',
          'cl.description',
          'cl.sharing_option',
          'cl.thumbnail',
          'cl.created_at',
          'cl.updated_at'
        )
          .from('content_lists as cl')
          .where({ sharing_option: 'public' })
          .innerJoin('users as u', 'cl.user_id', 'u.id')
          .where({ 'u.id': user_id })
          .union(function () {
            this.select(
              'cl.id',
              'cl.user_id',
              'u.name as user_name',
              'cl.title',
              'cl.description',
              'cl.sharing_option',
              'cl.thumbnail',
              'cl.created_at',
              'cl.updated_at'
            )
              .from('content_lists as cl')
              .where({ sharing_option: 'followed_profiles' })
              .innerJoin('users as u', 'cl.user_id', 'u.id')
              .whereIn('u.id', followMeIds)
              .andWhere({ 'u.id': user_id });
          })
          .union(function () {
            this.select(
              'cl.id',
              'cl.user_id',
              'u.name as user_name',
              'cl.title',
              'cl.description',
              'cl.sharing_option',
              'cl.thumbnail',
              'cl.created_at',
              'cl.updated_at'
            )
              .from('content_lists as cl')
              .where({ sharing_option: 'private' })
              .innerJoin('users as u', 'cl.user_id', 'u.id')
              .where({ 'u.id': userId })
              .andWhere({ 'u.id': user_id });
          })
          .as('clsq');
      })
      .limit(page_size)
      .offset((page - 1) * page_size)
      .orderBy('updated_at', 'desc');

    const [{ count }] = await knex.count().from(function () {
      this.select()
        .from(function () {
          this.select('cl.id', 'cl.user_id')
            .from('content_lists as cl')
            .where({ sharing_option: 'public' })
            .andWhere({ 'cl.user_id': user_id })
            .as('public_lists');
        })
        .union(function () {
          this.select('cl.id', 'cl.user_id')
            .from('content_lists as cl')
            .where({ sharing_option: 'followed_profiles' })
            .whereIn('cl.user_id', followMeIds)
            .andWhere({ 'cl.user_id': user_id });
        })
        .union(function () {
          this.select('cl.id', 'cl.user_id')
            .from('content_lists as cl')
            .where({ sharing_option: 'private' })
            .where('cl.user_id', userId)
            .andWhere({ 'cl.user_id': user_id });
        })
        .as('count_query');
    });

    return { contentLists, count };
  } catch (error) {
    throw error;
  }
};

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

      const { title, description, content: content_list } = JSON.parse(data);
      const errors = [];

      if (!title) {
        errors.push('Título da lista não informado');
      } else if (typeof title !== 'string') {
        errors.push('Título da lista, valor inválido');
      }
      if (description && typeof description !== 'string') {
        errors.push('Descrição da lista, valor inválido');
      }
      if (!req.file) {
        errors.push('Thumbnail da lista não informada');
      }
      if (!content_list) {
        errors.push('Conteúdo da lista não informado');
      } else if (!Array.isArray(content_list)) {
        errors.push('Conteúdo da lista, valor inválido');
      } else if (content_list.length < 1 || content_list.length > 100) {
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
        thumbnail,
        content_list
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

      const { user_id, page = 1, page_size = 30 } = req.query;

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
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const usersWhoFollowMe = userId
        ? [
            { user_id: userId },
            ...(await knex
              .select('user_id')
              .from('follows_users')
              .where({ follows_id: userId })),
          ]
        : [];
      const followMeIds = usersWhoFollowMe.map((u) => u.user_id);

      const { contentLists, count } = user_id
        ? await getUsersContentLists(
            userId,
            user_id,
            followMeIds,
            page_size,
            page
          )
        : await getContentLists(followMeIds, page_size, page);

      for (const [i, list] of contentLists.entries()) {
        const contentTypes = await knex
          .select('name')
          .from('content_list_types')
          .innerJoin(
            'content_types',
            'content_types.id',
            'content_list_types.content_type_id'
          )
          .andWhere({ content_list_id: list.id });
        contentLists[i].content_types = contentTypes.map((type) => type.name);
      }

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
          content_types: list.content_types,
          created_at: list.created_at,
          updated_at: list.updated_at,
        })),
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const contentListId = req.params.id;

      if (isNaN(contentListId)) {
        return res.sendStatus(404);
      }

      const contentList = await knex
        .select(
          'content_lists.id',
          'content_lists.user_id',
          'users.name as user_name',
          'content_lists.title',
          'content_lists.description',
          'content_lists.thumbnail',
          'content_lists.created_at',
          'content_lists.updated_at'
        )
        .from('content_lists')
        .where({
          'content_lists.id': contentListId,
        })
        .innerJoin('users', 'content_lists.user_id', 'users.id')
        .first();

      if (!contentList) {
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      const contentTypes = await knex
        .select('name')
        .from('content_list_types')
        .innerJoin(
          'content_types',
          'content_types.id',
          'content_list_types.content_type_id'
        )
        .andWhere({ content_list_id: contentList.id });
      contentList.content_types = contentTypes.map((type) => type.name);

      const content = await knex
        .select(
          'movie_id as content_id',
          'tmdb_id as content_platform_id',
          'title',
          'poster_path',
          knex.raw("'movie' as type")
        )
        .from('content_list_movies as clm')
        .innerJoin('movies as m', 'clm.movie_id', 'm.id')
        .andWhere({ 'clm.content_list_id': contentListId })
        .union([
          knex
            .select(
              'show_id as content_id',
              'tmdb_id as content_platform_id',
              'name as title',
              'poster_path',
              knex.raw("'show' as type")
            )
            .from('content_list_shows as cls')
            .innerJoin('shows as s', 'cls.show_id', 's.id')
            .andWhere({ 'cls.content_list_id': contentListId }),
        ])
        .union([
          knex
            .select(
              'game_id as content_id',
              'rawg_id as content_platform_id',
              'name as title',
              'background_image as poster_path',
              knex.raw("'game' as type")
            )
            .from('content_list_games as clg')
            .innerJoin('games as g', 'clg.game_id', 'g.id')
            .andWhere({ 'clg.content_list_id': contentListId }),
        ])
        .orderBy('title');
      contentList.content = content;

      return res.json({
        id: contentList.id,
        user_id: contentList.user_id,
        user_name: contentList.user_name,
        title: contentList.title,
        description: contentList.description,
        thumbnail: contentList.thumbnail,
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

      const { title, description, content: content_list } = JSON.parse(data);
      const errors = [];

      if (!title) {
        errors.push('Título da lista não informado');
      } else if (typeof title !== 'string') {
        errors.push('Título da lista, valor inválido');
      }
      if (description && typeof description !== 'string') {
        errors.push('Descrição da lista, valor inválido');
      }
      if (!req.file) {
        errors.push('Thumbnail da lista não informada');
      }
      if (!content_list) {
        errors.push('Conteúdo da lista não informado');
      } else if (!Array.isArray(content_list)) {
        errors.push('Conteúdo da lista, valor inválido');
      } else if (content_list.length < 1 || content_list.length > 100) {
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

      await deleteFile(
        contentList.thumbnail.substring(`${process.env.APP_URL}/files/`.length)
      );
      const thumbnail = `${process.env.APP_URL}/files/${req.file.key}`;

      await updateContentListOnDB(
        contentListId,
        title,
        description,
        thumbnail,
        content_list
      );

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
