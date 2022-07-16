const knex = require('../../database');

module.exports = async (contentListId) => {
  try {
    const contentList = await knex
      .select(
        'cl.id',
        'cl.profile_id',
        'profiles.name as profile_name',
        'profiles.profile_image_url',
        'cl.title',
        'cl.description',
        'cl.sharing_option',
        'cl.thumbnail',
        'content_types',
        knex.raw('COALESCE(likes, 0) AS likes'),
        knex.raw('COALESCE(forks, 0) AS forks'),
        'cl.created_at',
        'cl.updated_at'
      )
      .from('content_lists as cl')
      .where({
        'cl.id': contentListId,
      })
      .innerJoin('profiles', 'cl.profile_id', 'profiles.id')
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
          .select('original_list_id as list_id', knex.raw('COUNT(*) AS forks'))
          .from('content_list_forks')
          .groupBy('list_id')
          .as('clf'),
        'clf.list_id',
        'cl.id'
      )
      .first();

    if (contentList) {
      contentList.likes = parseInt(contentList.likes);
      contentList.forks = parseInt(contentList.forks);
    }

    return contentList;
  } catch (error) {
    throw error;
  }
};
