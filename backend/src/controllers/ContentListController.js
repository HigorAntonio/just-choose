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

const createContentListOnDB = async (
  userId,
  title,
  description,
  thumbnail,
  content_list
) => {
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
          'Conteúdo da lista inválido. O número de items deve ficar entre 1 e 100'
        );
      }
      if (errors.length > 0) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erros: errors });
      }

      const { key: fileKey } = req.file;
      const thumbnail = `${process.env.APP_URL}/files/${fileKey}`;

      await createContentListOnDB(
        userId,
        title,
        description,
        thumbnail,
        content_list
      );

      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
      try {
        await deleteFile(req.file.key);
      } catch (error) {}
      return res.sendStatus(500);
    }
  },

  async index(req, res) {
    try {
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

      const contentListsQuery = knex('content_lists')
        .select(
          'content_lists.id',
          'content_lists.user_id',
          'users.method as login_method',
          'content_lists.title',
          'content_lists.description',
          'content_lists.thumbnail',
          'content_lists.created_at',
          'content_lists.updated_at'
        )
        .innerJoin('users', 'user_id', 'users.id')
        .limit(page_size)
        .offset((page - 1) * page_size)
        .orderBy('content_lists.updated_at', 'desc');

      const countObj = knex('content_lists').count();

      if (user_id) {
        contentListsQuery.where('users.id', user_id);
        countObj.where({ user_id });
      }

      const contentLists = await contentListsQuery;
      const [{ count }] = await countObj;

      for (const [i, list] of contentLists.entries()) {
        // Adiciona o username para usuários logados com o método local
        if (list.login_method === 'local') {
          const { name: userName } = await knex('local_users')
            .select('name')
            .where({ id: list.user_id })
            .first();
          contentLists[i].user_name = userName;
        }
        // TODO: Adicionar o username para usuário logados com o método Twitch

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
          // login_method: list.login_method,
          user_name: list.user_name,
          title: list.title,
          description: list.description,
          thumbnail: list.thumbnail,
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
      const contentListId = req.params.id;

      if (isNaN(contentListId)) {
        return res.sendStatus(404);
      }

      const contentList = await knex
        .select(
          'content_lists.id',
          'content_lists.user_id',
          'users.method as login_method',
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

      // Adiciona o username para usuários logados com o método local
      if (contentList.login_method === 'local') {
        const { name: userName } = await knex('local_users')
          .select('name')
          .where({ id: contentList.user_id })
          .first();
        contentList.user_name = userName;
      }
      // TODO: Adicionar o username para usuário logados com o método Twitch

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

      return res.json({
        id: contentList.id,
        user_id: contentList.user_id,
        // login_method: contentList.login_method,
        user_name: contentList.user_name,
        title: contentList.title,
        description: contentList.description,
        thumbnail: contentList.thumbnail,
        content_types: contentList.content_types,
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
      } = JSON.parse(data);

      const thumbnail = req.file
        ? `${process.env.APP_URL}/files/${req.file.key}`
        : contentList.thumbnail;

      const errors = [];
      if (!title) {
        errors.push('Título da lista não informado');
      } else if (typeof title !== 'string') {
        errors.push('Título da lista, valor inválido');
      }
      if (description && typeof description !== 'string') {
        errors.push('Descrição da lista, valor inválido');
      }
      if (errors.length > 0) {
        try {
          await deleteFile(req.file.key);
        } catch (error) {}
        return res.status(400).json({ erros: errors });
      }

      await knex('content_lists')
        .update({ title, description, thumbnail })
        .where({ id: contentListId });

      if (req.file) {
        await deleteFile(
          contentList.thumbnail.substr(`${process.env.APP_URL}/files/`.length)
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
        contentList.thumbnail.substr(`${process.env.APP_URL}/files/`.length)
      );

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
