const knex = require('../database');

module.exports = {
  key: 'InsertShowsOnDatabase',
  async handle({ data }) {
    const { results } = data;

    const shows = results.map((show) => ({
      tmdb_id: show.id,
      original_name: show.original_name,
      name: show.name,
      poster_path: show.poster_path,
    }));

    const showsIds = shows.map((show) => show.tmdb_id);

    const showsInDb = await knex
      .select('tmdb_id')
      .from('shows')
      .whereIn('tmdb_id', showsIds);

    const showsInDbIds = showsInDb.map((show) => show.tmdb_id);

    const showsToInsertIds = showsIds.filter(
      (showId) => !showsInDbIds.includes(showId)
    );

    const showsToInsert = shows.filter((show) =>
      showsToInsertIds.includes(show.tmdb_id)
    );

    await knex('shows').insert(showsToInsert);
  },
};
