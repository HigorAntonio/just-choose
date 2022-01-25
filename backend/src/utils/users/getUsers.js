const knex = require('../../database');

module.exports = async (options) => {
  const { pageSize, page, query, exactName, sortBy } = options;

  try {
    const usersQuery = knex
      .select(
        'u.id',
        'u.name',
        'u.profile_image_url',
        knex.raw('COALESCE(followers_count, 0) AS followers_count'),
        knex.raw('COALESCE(following_count, 0) AS following_count')
      )
      .from('users as u')
      .leftJoin(
        knex
          .select('follows_id', knex.raw('COUNT(*) AS followers_count'))
          .from('follows_users')
          .groupBy('follows_id')
          .as('fers'),
        'u.id',
        'fers.follows_id'
      )
      .leftJoin(
        knex
          .select('user_id', knex.raw('COUNT(*) AS following_count'))
          .from('follows_users')
          .groupBy('user_id')
          .as('fing'),
        'u.id',
        'fing.user_id'
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (sortBy) {
      usersQuery.orderByRaw(sortBy);
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

    if (exactName) {
      usersQuery.where({ 'u.name': exactName });
      countObj.where({ 'u.name': exactName });
    }

    const users = (await usersQuery).map((u) => {
      u.followers_count = parseInt(u.followers_count);
      u.following_count = parseInt(u.following_count);
      return u;
    });
    const [{ count }] = await countObj;

    return { users, count: parseInt(count) };
  } catch (error) {
    throw error;
  }
};
