const knex = require('../database');

module.exports = {
  async show(req, res) {
    try {
      const pollId = req.params.id;
      if (isNaN(pollId)) {
        return res.sendStatus(404);
      }

      const poll = await knex('polls').where({ id: pollId }).first();
      if (!poll) {
        return res.status(400).json({ erro: 'Votação não encontrada' });
      }
      if (poll.is_active) {
        return res.status(403).json({ erro: 'Votação em andamento' });
      }

      const votes = await knex
        .select('content_list_movies.movie_id')
        .from('poll_content_list')
        .where({ 'poll_content_list.poll_id': pollId })
        .innerJoin(
          'content_list_movies',
          'poll_content_list.content_list_id',
          'content_list_movies.content_list_id'
        )
        .leftJoin(
          'movie_votes',
          function () {
            this.on(
              'content_list_movies.movie_id',
              '=',
              'movie_votes.movie_id'
            ).andOn('movie_votes.poll_id', '=', 'poll_content_list.poll_id');
          },
          'content_list_movies.movie_id',
          'movie_votes.movie_id'
        )
        .count('movie_votes.id as votes')
        .groupBy('content_list_movies.movie_id', 'movies.id')
        .orderBy('votes', 'desc')
        .innerJoin('movies', 'content_list_movies.movie_id', 'movies.id')
        .select('movies.title', 'movies.tmdb_id');
      // TODO: Consulta com os votos para os outros tipos de conteúdo (show, game, etc.)

      const [{ count: countMovieVotes }] = await knex('movie_votes')
        .count()
        .where({ poll_id: pollId });
      // TODO: Consultar o total de votos para os outros tipos de conteúdo (show, game, etc.)

      return res.json({
        poll_id: poll.id,
        poll_title: poll.title,
        total_votes: parseInt(countMovieVotes),
        items: votes,
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },
};
