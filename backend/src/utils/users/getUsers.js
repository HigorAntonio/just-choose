const knex = require('../../database');

module.exports = async (page_size, page, query, exact_name, sort_by) => {
  try {
    const usersQuery = knex
      .select(
        'u.id',
        'u.name',
        'u.profile_image_url',
        knex.raw('COALESCE(followers, 0) AS followers'),
        knex.raw('COALESCE(following, 0) AS following')
      )
      .from('users as u')
      .leftJoin(
        knex
          .select('follows_id', knex.raw('COUNT(*) AS followers'))
          .from('follows_users')
          .groupBy('follows_id')
          .as('fers'),
        'u.id',
        'fers.follows_id'
      )
      .leftJoin(
        knex
          .select('user_id', knex.raw('COUNT(*) AS following'))
          .from('follows_users')
          .groupBy('user_id')
          .as('fing'),
        'u.id',
        'fing.user_id'
      )
      .limit(page_size)
      .offset((page - 1) * page_size);

    if (sort_by) {
      usersQuery.orderByRaw(sort_by);
    }

    const countObj = knex.count().from('users as u');

    if (query) {
      usersQuery.where(
        knex.raw('u.document @@ users_plainto_tsquery(:query)', { query })
      );
      countObj.where(
        knex.raw('u.document @@ users_plainto_tsquery(:query)', { query })
      );
    }

    if (exact_name) {
      usersQuery.where({ 'u.name': exact_name });
      countObj.where({ 'u.name': exact_name });
    }

    const users = await usersQuery;
    const [{ count }] = await countObj;

    return { users, count };
  } catch (error) {
    throw error;
  }
};
