const knex = require('../database');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.sendStatus(401);
      }

      const { movieId } = req.body;
      const pollId = req.params.id;

      const errors = [];
      if (!movieId) {
        errors.push('Filme a ser votado não informado');
      } else if (isNaN(movieId)) {
        errors.push('Filme a ser votado, valor inválido');
      }
      if (!pollId) {
        errors.push('Votação não informada');
      } else if (isNaN(pollId)) {
        errors.push('Votação, valor inválido');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const poll = await knex('polls').where({ id: pollId }).first();
      if (!poll) {
        return res.status(400).json({ erro: 'Votação não encontrada' });
      }
      if (!poll.is_active) {
        return res.status(403).json({ erro: 'Votação desativada' });
      }

      const movie = await knex
        .from('poll_content_list')
        .where({ poll_id: pollId })
        .innerJoin('content_list_movies', function () {
          this.on(
            'poll_content_list.content_list_id',
            '=',
            'content_list_movies.content_list_id'
          ).andOn({ 'content_list_movies.movie_id': movieId });
        })
        .first();
      if (!movie) {
        return res.status(400).json({ erro: 'Filme não encontrado' });
      }

      const vote = await knex('movie_votes')
        .where({
          user_id: userId,
          movie_id: movieId,
          poll_id: pollId,
        })
        .first();
      if (vote) {
        return res.status(403).json({ erro: 'Número de votos excedido' });
      }

      await knex('movie_votes').insert({
        user_id: userId,
        movie_id: movieId,
        poll_id: pollId,
      });

      return res.sendStatus(201);
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async delete(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.sendStatus(401);
      }

      const pollId = req.params.id;
      if (isNaN(pollId)) {
        return res.sendStatus(404);
      }

      const poll = await knex('polls').where({ id: pollId }).first();
      if (!poll) {
        return res.status(400).json({ erro: 'Votação não encontrada' });
      }
      if (!poll.is_active) {
        return res.status(403).json({ erro: 'Votação desativada' });
      }

      const voto = await knex('movie_votes')
        .where({ user_id: userId, poll_id: pollId })
        .first();
      if (!voto) {
        return res.status(400).json({ erro: 'Voto não encontrado' });
      }

      await knex('movie_votes')
        .del()
        .where({ user_id: userId, poll_id: pollId });

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
