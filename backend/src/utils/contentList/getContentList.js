const knex = require('../../database');

module.exports = async (contentListId) => {
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
        .select('original_list_id as list_id', knex.raw('COUNT(*) AS forks'))
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
              knex.raw(`COALESCE(poster_path, '') AS poster_path`),
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
              knex.raw(`COALESCE(poster_path, '') AS poster_path`),
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
              knex.raw(`COALESCE(background_image, '') AS poster_path`),
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

  if (contentList) {
    Object.keys(contentList.content).map((type) => {
      if (!contentList.content[type].length) {
        delete contentList.content[type];
      }
    });
  }

  return contentList;
};
