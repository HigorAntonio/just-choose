const knex = require('../../database');

module.exports = async (options) => {
  const { pollId, pageSize, page, type, sortBy } = options;

  try {
    const { is_active: isActive } = await knex
      .select('is_active')
      .from('polls')
      .where({ id: pollId })
      .first();

    const contentQuery = knex
      .select()
      .from(function () {
        this.select()
          .from(function () {
            this.select(
              'm.id as content_id',
              'm.tmdb_id as content_platform_id',
              'm.title',
              knex.raw(`COALESCE(m.poster_path, '') AS poster_path`),
              knex.raw(`'movie' AS type`),
              knex.raw('COALESCE(COUNT(mv.movie_id), 0) AS votes')
            )
              .from('content_list_movies as clm')
              .innerJoin('movies as m', 'clm.movie_id', 'm.id')
              .leftJoin(
                function () {
                  this.select()
                    .from('movie_votes as mv')
                    .where({ 'mv.poll_id': pollId })
                    .as('mv');
                },
                'clm.movie_id',
                'mv.movie_id'
              )
              .whereIn('clm.content_list_id', function () {
                this.select('pcl.content_list_id')
                  .from('poll_content_list as pcl')
                  .where({ 'pcl.poll_id': pollId });
              })
              .groupBy('m.id')
              .as('movie_content');
          })
          .union(function () {
            this.select(
              's.id as content_id',
              's.tmdb_id as content_platform_id',
              's.name as title',
              knex.raw(`COALESCE(s.poster_path, '') AS poster_path`),
              knex.raw(`'show' AS type`),
              knex.raw('COALESCE(COUNT(sv.show_id), 0) AS votes')
            )
              .from('content_list_shows as cls')
              .innerJoin('shows as s', 'cls.show_id', 's.id')
              .leftJoin(
                function () {
                  this.select()
                    .from('show_votes as sv')
                    .where({ 'sv.poll_id': pollId })
                    .as('sv');
                },
                'cls.show_id',
                'sv.show_id'
              )
              .whereIn('cls.content_list_id', function () {
                this.select('pcl.content_list_id')
                  .from('poll_content_list as pcl')
                  .where({ 'pcl.poll_id': pollId });
              })
              .groupBy('s.id');
          })
          .union(function () {
            this.select(
              'g.id as content_id',
              'g.rawg_id as content_platform_id',
              'g.name as title',
              knex.raw(`COALESCE(g.background_image, '') AS poster_path`),
              knex.raw(`'game' AS type`),
              knex.raw('COALESCE(COUNT(gv.game_id), 0) AS votes')
            )
              .from('content_list_games as clg')
              .innerJoin('games as g', 'clg.game_id', 'g.id')
              .leftJoin(
                function () {
                  this.select()
                    .from('game_votes as gv')
                    .where({ 'gv.poll_id': pollId })
                    .as('gv');
                },
                'clg.game_id',
                'gv.game_id'
              )
              .whereIn('clg.content_list_id', function () {
                this.select('pcl.content_list_id')
                  .from('poll_content_list as pcl')
                  .where({ 'pcl.poll_id': pollId });
              })
              .groupBy('g.id');
          })
          .as('content');
      })
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (
      (sortBy && !isActive) ||
      (sortBy && isActive && !sortBy.includes('votes'))
    ) {
      contentQuery.orderByRaw(sortBy);
    }

    const countObj = knex.count().from(function () {
      this.distinct('content.content_id', 'content.type')
        .from(function () {
          this.select(
            'clm.movie_id as content_id',
            'clm.content_list_id',
            knex.raw(`'movie' AS type`)
          )
            .from('content_list_movies as clm')
            .union(function () {
              this.select(
                'cls.show_id as content_id',
                'cls.content_list_id',
                knex.raw(`'show' AS type`)
              ).from('content_list_shows as cls');
            })
            .union(function () {
              this.select(
                'clg.game_id as content_id',
                'clg.content_list_id',
                knex.raw(`'game' AS type`)
              ).from('content_list_games as clg');
            })
            .as('content');
        })
        .whereIn('content.content_list_id', function () {
          this.select('pcl.content_list_id')
            .from('poll_content_list as pcl')
            .where({ 'pcl.poll_id': pollId });
        })
        .as('content');
    });

    if (type) {
      contentQuery.where({ type: type });
      countObj.where({ type: type });
    }

    const content = (await contentQuery).map((c) => {
      if (isActive) {
        delete c.votes;
        return c;
      }
      c.votes = parseInt(c.votes);
      return c;
    });
    const [{ count }] = await countObj;

    return { content, count: parseInt(count) };
  } catch (error) {
    throw error;
  }
};
