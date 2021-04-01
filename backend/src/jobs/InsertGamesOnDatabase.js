const knex = require('../database');

module.exports = {
  key: 'InsertGamesOnDatabase',
  async handle({ data }) {
    const { results } = data;

    const games = results.map((game) => ({
      rawg_id: game.id,
      name: game.name,
      background_image: game.background_image,
    }));

    const gamesIds = games.map((game) => game.rawg_id);

    const gamesInDb = await knex
      .select('rawg_id')
      .from('games')
      .whereIn('rawg_id', gamesIds);

    const gamesInDbIds = gamesInDb.map((game) => game.rawg_id);

    const gamesToInsertIds = gamesIds.filter(
      (gameId) => !gamesInDbIds.includes(gameId)
    );

    const gamesToInsert = games.filter((game) =>
      gamesToInsertIds.includes(game.rawg_id)
    );

    await knex('games').insert(gamesToInsert);
  },
};
