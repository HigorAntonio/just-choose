const knex = require('../../database');

module.exports = async (pollId, contentListId) => {
  try {
    const results = await knex
      .select()
      .from(function () {
        this.select(
          's1.content_id',
          's1.type',
          's1.content_platform_id',
          's1.title',
          's1.poster_path'
        )
          .count('mv.id as votes')
          .from(function () {
            this.select(
              'movie_id as content_id',
              'tmdb_id as content_platform_id',
              'title',
              'poster_path',
              knex.raw("'movie' as type")
            )
              .from('content_list_movies as clm')
              .innerJoin('movies as m', 'clm.movie_id', 'm.id')
              .andWhere({ 'clm.content_list_id': contentListId })
              .as('s1');
          })
          .leftJoin('movie_votes as mv', function () {
            this.on('s1.content_id', '=', 'mv.movie_id').andOn(
              'mv.poll_id',
              '=',
              pollId
            );
          })
          .groupBy(
            's1.content_id',
            's1.content_platform_id',
            's1.title',
            's1.poster_path',
            's1.type',
            'mv.movie_id'
          )
          .as('query');
      })
      .union(function () {
        this.select(
          's2.content_id',
          's2.type',
          's2.content_platform_id',
          's2.title',
          's2.poster_path'
        )
          .count('sv.id as votes')
          .from(function () {
            this.select(
              'show_id as content_id',
              'tmdb_id as content_platform_id',
              'name as title',
              'poster_path',
              knex.raw("'show' as type")
            )
              .from('content_list_shows as cls')
              .innerJoin('shows as s', 'cls.show_id', 's.id')
              .andWhere({ 'cls.content_list_id': contentListId })
              .as('s2');
          })
          .leftJoin('show_votes as sv', function () {
            this.on('s2.content_id', '=', 'sv.show_id').andOn(
              'sv.poll_id',
              '=',
              pollId
            );
          })
          .groupBy(
            's2.content_id',
            's2.content_platform_id',
            's2.title',
            's2.poster_path',
            's2.type',
            'sv.show_id'
          );
      })
      .union(function () {
        this.select(
          's3.content_id',
          's3.type',
          's3.content_platform_id',
          's3.title',
          's3.poster_path'
        )
          .count('gv.id as votes')
          .from(function () {
            this.select(
              'game_id as content_id',
              'rawg_id as content_platform_id',
              'name as title',
              'background_image as poster_path',
              knex.raw("'game' as type")
            )
              .from('content_list_games as clg')
              .innerJoin('games as g', 'clg.game_id', 'g.id')
              .andWhere({ 'clg.content_list_id': contentListId })
              .as('s3');
          })
          .leftJoin('game_votes as gv', function () {
            this.on('s3.content_id', '=', 'gv.game_id').andOn(
              'gv.poll_id',
              '=',
              pollId
            );
          })
          .groupBy(
            's3.content_id',
            's3.content_platform_id',
            's3.title',
            's3.poster_path',
            's3.type',
            'gv.game_id'
          );
      })
      .orderBy('votes', 'desc')
      .orderBy('title', 'asc');

    const [{ total_votes }] = await knex
      .sum('count as total_votes')
      .from(function () {
        this.count()
          .from('movie_votes as mv')
          .where({ ['mv.poll_id']: pollId })
          .unionAll(function () {
            this.count()
              .from('show_votes as sv')
              .where({ ['sv.poll_id']: pollId });
          })
          .unionAll(function () {
            this.count()
              .from('game_votes as gv')
              .where({ ['gv.poll_id']: pollId });
          })
          .as('count_votes');
      });

    return {
      total_votes: parseInt(total_votes),
      results: results.map((r) => ({ ...r, votes: parseInt(r.votes) })),
    };
  } catch (error) {
    throw error;
  }
};
