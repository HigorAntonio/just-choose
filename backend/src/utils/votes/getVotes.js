const knex = require('../../database');

module.exports = async (userId, page_size, page, sort_by) => {
  try {
    const votesQuery = knex
      .select(
        'p.user_id as poll_user_id',
        'u.name as poll_user_name',
        'u.profile_image_url as poll_user_profile_image_url',
        'poll_id',
        'p.title as poll_title',
        'p.description as poll_description',
        'p.sharing_option as poll_sharing_option',
        'p.is_active as poll_is_active',
        'p.thumbnail as poll_thumbnail',
        'vote_user_id',
        'vote_content_id',
        'vote_content_platform_id',
        'vote_content_title',
        'vote_content_poster_path',
        'vote_content_type',
        'votes_union_query.updated_at'
      )
      .from(function () {
        this.select(
          'mv.poll_id',
          'mv.user_id as vote_user_id',
          'mv.movie_id AS vote_content_id',
          'm.tmdb_id as vote_content_platform_id',
          'm.title AS vote_content_title',
          'm.poster_path as vote_content_poster_path',
          knex.raw(`'movie' AS vote_content_type`),
          'mv.updated_at'
        )
          .from('movie_votes as mv')
          .innerJoin('movies as m', 'm.id', 'mv.movie_id')
          .union(function () {
            this.select(
              'sv.poll_id',
              'sv.user_id as vote_user_id',
              'sv.show_id AS vote_content_id',
              's.tmdb_id as vote_content_platform_id',
              's.name AS vote_content_title',
              's.poster_path as vote_content_poster_path',
              knex.raw(`'show' AS vote_content_type`),
              'sv.updated_at'
            )
              .from('show_votes AS sv')
              .innerJoin('shows as s', 's.id', 'sv.show_id');
          })
          .as('show_votes_query')
          .union(function () {
            this.select(
              'gv.poll_id',
              'gv.user_id as vote_user_id',
              'gv.game_id AS vote_content_id',
              'g.rawg_id as vote_content_platform_id',
              'g.name AS vote_content_title',
              'g.background_image as vote_content_poster_path',
              knex.raw(`'game' AS vote_content_type`),
              'gv.updated_at'
            )
              .from('game_votes as gv')
              .innerJoin('games as g', 'g.id', 'gv.game_id');
          })
          .as('votes_union_query');
      })
      .innerJoin('polls as p', 'p.id', 'poll_id')
      .innerJoin('users as u', 'u.id', 'p.user_id')
      .where('vote_user_id', userId)
      .limit(page_size)
      .offset((page - 1) * page_size);

    if (sort_by) {
      votesQuery.orderByRaw(sort_by);
    }

    const countObj = await knex.count().from(function () {
      this.select()
        .from(function () {
          this.select()
            .from('movie_votes as mv')
            .union(function () {
              this.select()
                .from('show_votes as sv')
                .union(function () {
                  this.select().from('game_votes as gv');
                });
            })
            .as('count_votes_union_query');
        })
        .where('count_votes_union_query.user_id', userId)
        .as('count_votes_query');
    });

    const votes = await votesQuery;
    const [{ count }] = await countObj;

    return { votes, count };
  } catch (error) {
    throw error;
  }
};
