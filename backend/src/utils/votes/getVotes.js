const knex = require('../../database');

module.exports = async (options) => {
  const { profileId, pageSize, page, query, sortBy } = options;

  try {
    const votesQuery = knex
      .select(
        'po.profile_id as poll_profile_id',
        'pr.name as poll_profile_name',
        'pr.display_name as poll_profile_display_name',
        'pr.profile_image_url as poll_profile_profile_image_url',
        'votes_union_query.poll_id',
        'po.title as poll_title',
        'po.description as poll_description',
        'po.sharing_option as poll_sharing_option',
        'po.is_active as poll_is_active',
        'po.thumbnail as poll_thumbnail',
        knex.raw('COALESCE(total_votes, 0) as poll_total_votes'),
        'vote_profile_id',
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
          'mv.profile_id as vote_profile_id',
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
              'sv.profile_id as vote_profile_id',
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
          .union(function () {
            this.select(
              'gv.poll_id',
              'gv.profile_id as vote_profile_id',
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
      .leftJoin(
        knex
          .select('poll_id', knex.raw('SUM(votes) AS total_votes'))
          .from(function () {
            this.select()
              .from(function () {
                this.select('poll_id', knex.raw('COUNT(id) AS votes'))
                  .from('movie_votes')
                  .groupBy('poll_id')
                  .as('movie_votes_count');
              })
              .unionAll(function () {
                this.select('poll_id', knex.raw('COUNT(id) AS votes'))
                  .from('show_votes')
                  .groupBy('poll_id');
              })
              .unionAll(function () {
                this.select('poll_id', knex.raw('COUNT(id) AS votes'))
                  .from('game_votes')
                  .groupBy('poll_id');
              })
              .as('poll_votes');
          })
          .groupBy('poll_id')
          .as('poll_total_votes'),
        'poll_total_votes.poll_id',
        'votes_union_query.poll_id'
      )
      .innerJoin('polls as po', 'po.id', 'votes_union_query.poll_id')
      .innerJoin('profiles as pr', 'pr.id', 'po.profile_id')
      .where('vote_profile_id', profileId)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (sortBy) {
      votesQuery.orderByRaw(sortBy);
    }

    const countObj = knex.count().from(function () {
      this.select('vote_profile_id', 'poll_id', 'po.document as poll_document')
        .from(function () {
          this.select('profile_id as vote_profile_id', 'poll_id')
            .from('movie_votes as mv')
            .union(function () {
              this.select('profile_id as vote_profile_id', 'poll_id')
                .from('show_votes as sv')
                .union(function () {
                  this.select('profile_id as vote_profile_id', 'poll_id').from(
                    'game_votes as gv'
                  );
                });
            })
            .as('count_votes_union_query');
        })
        .innerJoin('polls as po', 'po.id', 'count_votes_union_query.poll_id')
        .where('count_votes_union_query.vote_profile_id', profileId)
        .as('count_votes_query');
    });

    if (query) {
      votesQuery.where(
        knex.raw('po.document @@ polls_plainto_tsquery(:query)', { query })
      );
      countObj.where(
        knex.raw('poll_document @@ polls_plainto_tsquery(:query)', { query })
      );
    }

    const votes = (await votesQuery).map((v) => {
      v.poll_total_votes = parseInt(v.poll_total_votes);
      return v;
    });
    const [{ count }] = await countObj;

    return { votes, count: parseInt(count) };
  } catch (error) {
    throw error;
  }
};
