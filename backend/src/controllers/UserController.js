const knex = require('../database');

module.exports = {
  async index(req, res) {
    try {
      const { query, page = 1, page_size = 30 } = req.query;

      const errors = [];
      if (query && typeof query !== 'string') {
        errors.push({ erro: 'O parâmetro query deve ser uma string' });
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

      const usersQuery = knex
        .select('u.id', 'u.name', 'u.profile_image_url')
        .from('users as u')
        .limit(page_size)
        .offset((page - 1) * page_size);

      const countQuery = knex.count().from('users as u');

      if (query) {
        usersQuery.where(
          knex.raw('u.document @@ users_plainto_tsquery(:query)', { query })
        );

        countQuery.where(
          knex.raw('u.document @@ users_plainto_tsquery(:query)', { query })
        );
      }

      const users = await usersQuery;

      const [{ count }] = await countQuery;

      const total_pages = Math.ceil(count / page_size);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(page_size),
        total_pages: total_pages === 0 ? 1 : total_pages,
        total_results: parseInt(count),
        items: users,
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },
};
