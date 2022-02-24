const knex = require('../../database');

module.exports = async (options) => {
  const { contentListId, pageSize, page, type, sortBy } = options;

  try {
    const contentQuery = knex
      .select()
      .from(function () {
        this.select(
          'm.id as content_id',
          'm.tmdb_id as content_platform_id',
          'm.title',
          knex.raw(`COALESCE(m.poster_path, '') AS poster_path`),
          knex.raw(`'movie' AS type`)
        )
          .from('content_list_movies as clm')
          .innerJoin('movies as m', 'clm.movie_id', 'm.id')
          .where({ 'clm.content_list_id': contentListId })
          .union(function () {
            this.select(
              's.id as content_id',
              's.tmdb_id as content_platform_id',
              's.name as title',
              knex.raw(`COALESCE(s.poster_path, '') AS poster_path`),
              knex.raw(`'show' AS type`)
            )
              .from('content_list_shows as cls')
              .innerJoin('shows as s', 'cls.show_id', 's.id')
              .where({ 'cls.content_list_id': contentListId });
          })
          .union(function () {
            this.select(
              'g.id as content_id',
              'g.rawg_id as content_platform_id',
              'g.name as title',
              knex.raw(`COALESCE(g.background_image, '') AS poster_path`),
              knex.raw(`'game' AS type`)
            )
              .from('content_list_games as clg')
              .innerJoin('games as g', 'clg.game_id', 'g.id')
              .where({ 'clg.content_list_id': contentListId });
          })
          .as('content');
      })
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (sortBy) {
      contentQuery.orderByRaw(sortBy);
    }

    const countObj = knex.count().from(function () {
      this.select('clm.id', knex.raw(`'movie' AS type`))
        .from('content_list_movies as clm')
        .where({ 'clm.content_list_id': contentListId })
        .union(function () {
          this.select('cls.id', knex.raw(`'show' AS type`))
            .from('content_list_shows as cls')
            .where({ 'cls.content_list_id': contentListId });
        })
        .union(function () {
          this.select('clg.id', knex.raw(`'game' AS type`))
            .from('content_list_games as clg')
            .where({ 'clg.content_list_id': contentListId });
        })
        .as('content');
    });

    if (type) {
      contentQuery.where({ type: type });
      countObj.where({ type: type });
    }

    const content = await contentQuery;
    const [{ count }] = await countObj;

    return { content, count: parseInt(count) };
  } catch (error) {
    throw error;
  }
};
