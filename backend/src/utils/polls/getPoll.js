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
        'p.thumbnail',
        'pcl.content_list_id',
        'p.is_active',
        'p.created_at',
        'p.updated_at'
      )
      .from('polls as p')
      .where({
        'p.id': pollId,
      })
      .innerJoin('users as u', 'p.user_id', 'u.id')
      .innerJoin('poll_content_list as pcl', 'poll_id', 'p.id')
      .first();

    return poll;
  } catch (error) {
    throw error;
  }
};
