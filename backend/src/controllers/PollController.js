const knex = require('../database');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.userId;
      
      if (!userId)
        return res.sendStatus(401);
      
      const { title } = req.body;
      if (!title)
        return res.status(400).json({ erro: 'Título não informado' });

      await knex('polls').insert({ user_id: userId, title });

      return res.sendStatus(201);
    } catch (err) {
      return res.sendStatus(500);
    }
  },

  async index(req, res) {
    try {
      const { user_id, page = 1, page_size = 30 } = req.query;

      if (page_size > 100)
        return res.status(400).json({ 
          erro: 'O tamanho da página não pode ser maior que 100' 
        });

      const queryLocal = knex('polls')
        .select(
          'polls.id',
          'polls.user_id',
          'local_users.name as created_by',
          'polls.title',  
          'polls.created_at',
          'polls.updated_at'
        )
        .join('local_users', 'local_users.user_id', '=', 'polls.user_id');

      const queryTwitch = knex('polls')
        .select(
          'polls.id',
          'polls.user_id',
          'twitch_users.name as created_by',
          'polls.title',  
          'polls.created_at',
          'polls.updated_at'
        )
        .join('twitch_users', 'twitch_users.user_id', '=', 'polls.user_id');
      
      const countObj = knex('polls').count();

      if (user_id) {
        const userExists = await knex('users').where({ id: user_id}).first();
        
        if(!userExists)
          return res.status(400).json({ erro: 'Usuário inválido' });

        queryLocal
          .where('polls.user_id', '=', user_id);
        
        queryTwitch
          .where('polls.user_id', '=', user_id);

        countObj
          .where({ user_id });
      }

      const [count] = await countObj;

      const queryResult = await queryLocal.union(queryTwitch)
        .limit(parseInt(page_size))
        .offset((parseInt(page) - 1) * parseInt(page_size))
        .orderBy('created_at', 'desc');

      const total_pages = Math.ceil(count["count"] / page_size);
      const result = {
        page: parseInt(page),
        page_size: parseInt(page_size),
        total_pages: total_pages === 0 ? 1 : total_pages,
        total_results: parseInt(count["count"]),
        items: queryResult
      }

      if (page > result.total_pages)
        return res.status(400).json({
            erro: 'Parâmetros de paginação fora dos limites' 
        });

      return res.json(result);    
    } catch (err) {
      return res.sendStatus(500);
    }
  },

  async update(req, res) {
    try {
      const { title } = req.body;
      const { id } = req.params;
      const userId = req.userId;

      if(!title)
        return res.status(400).json({ erro: 'Título não informado' });

      const poll = await knex('polls').where({ id }).first();

      if(!poll)
        return res.status(400).json({ erro: 'Id de votação inválido' });

      if (poll.user_id !== userId)
        return res.status(403).json({ erro: 'Usuário inválido' });

      await knex('polls').update({ title }).where({ id });

      return res.sendStatus(200);
    } catch (err) {
      return res.sendStatus(500);
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const poll = await knex('polls').where({ id }).first();

      if(!poll)
        return res.status(400).json({ erro: 'Id de votação inválido' });

      if (poll.user_id !== userId)
        return res.status(403).json({ erro: 'Usuário inválido' });

      await knex('polls').del().where({ id });

      return res.sendStatus(200);
    } catch (err) {
      return res.sendStatus(500);
    }
  }
}