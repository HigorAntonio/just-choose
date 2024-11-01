const knex = require('../../database');

module.exports = async (pollId) => {
  try {
    const poll = await knex
      .select(
        'p.id',
        'p.user_id',
        'u.name as user_name',
        'u.profile_image_url',
        'p.title',
        'p.description',
        'p.sharing_option',
        'p.is_active',
        'p.thumbnail',
        'cli.content_lists',
        'pct.content_types',
        knex.raw('COALESCE(total_votes, 0) as total_votes'),
        'p.created_at',
        'p.updated_at'
      )
      .from('polls as p')
      .innerJoin('users as u', 'p.user_id', 'u.id')
      .innerJoin(
        knex
          .select(
            'poll_id',
            knex.raw('ARRAY_AGG(content_list) AS content_lists')
          )
          .from(function () {
            this.select(
              'pcl.poll_id',
              knex.raw(`JSON_BUILD_OBJECT(
              'id', cl.id,
              'sharing_option', cl.sharing_option
            ) AS content_list`)
            )
              .from('poll_content_list as pcl')
              .innerJoin('content_lists as cl', 'pcl.content_list_id', 'cl.id')
              .where({ 'pcl.poll_id': pollId })
              .as('content_list_info');
          })
          .groupBy('poll_id')
          .as('cli'),
        'p.id',
        'cli.poll_id'
      )
      .innerJoin(
        knex
          .select('poll_id', knex.raw('ARRAY_AGG(name) AS content_types'))
          .from(function () {
            this.distinct('pcl.poll_id', 'ct.name')
              .from('poll_content_list as pcl')
              .innerJoin(
                'content_list_types as clt',
                'clt.content_list_id',
                'pcl.content_list_id'
              )
              .innerJoin('content_types as ct', 'ct.id', 'clt.content_type_id')
              .where({ 'pcl.poll_id': pollId })
              .as('poll_content_types');
          })
          .groupBy('poll_id')
          .as('pct'),
        'p.id',
        'pct.poll_id'
      )
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
        'p.id'
      )
      .where({
        'p.id': pollId,
      })
      .first();

    if (poll) {
      poll.total_votes = parseInt(poll.total_votes);
    }

    return poll;
  } catch (error) {
    throw error;
  }
};
