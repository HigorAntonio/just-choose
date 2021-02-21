const knex = require('../database');

module.exports = {
  key: 'InsertMoviesOnDatabase',
  async handle({ data }) {
    const { results } = data;

    const movies = results.map((movie) => ({
      tmdb_id: movie.id,
      original_title: movie.original_title,
      title: movie.title,
      poster_path: movie.poster_path,
    }));

    const moviesIds = movies.map((movie) => movie.tmdb_id);

    const moviesInDb = await knex
      .select('tmdb_id')
      .from('movies')
      .whereIn('tmdb_id', moviesIds);

    const moviesInDbIds = moviesInDb.map((movie) => movie.tmdb_id);

    const moviesToInsertIds = moviesIds.filter(
      (movieId) => !moviesInDbIds.includes(movieId)
    );

    const moviesToInsert = movies.filter((movie) =>
      moviesToInsertIds.includes(movie.tmdb_id)
    );

    await knex('movies').insert(moviesToInsert);
  },
};
