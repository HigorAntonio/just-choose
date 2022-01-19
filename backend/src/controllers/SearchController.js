const knex = require('../database');
const getFollowingUsers = require('../utils/users/getFollowingUsers');
const getUsers = require('../utils/users/getUsers');
const getPolls = require('../utils/polls/getPolls');
const getContentLists = require('../utils/contentList/getContentLists');

module.exports = {
  async index(req, res) {
    try {
      const userId = req.userId;

      const { query } = req.query;

      const errors = [];

      if (!query) {
        errors.push({ erro: 'Parâmetro query não informado' });
      } else if (typeof query !== 'string') {
        errors.push({ erro: 'O parâmetro query deve ser uma string' });
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const { users, count: usersCount } = await getUsers({
        pageSize: 10,
        page: 1,
        query,
        sortBy: 'followers_count DESC',
      });

      const usersWhoFollowMe = await getFollowingUsers(userId);
      const followMeIds = usersWhoFollowMe.map((u) => u.user_id);

      const { polls, count: pollsCount } = await getPolls({
        followMeIds,
        pageSize: 10,
        page: 1,
        query,
        sortBy: 'updated_at DESC',
      });

      const { contentLists, count: contentListsCount } = await getContentLists({
        followMeIds,
        pageSize: 10,
        page: 1,
        query,
        sortBy: 'likes DESC',
      });

      return res.json({
        profiles: {
          total_results: parseInt(usersCount),
          results: users.map((user) => ({
            id: user.id,
            name: user.name,
            profile_image_url: user.profile_image_url,
            followers_count: parseInt(user.followers_count),
            following_count: parseInt(user.following_count),
          })),
        },
        polls: {
          total_results: parseInt(pollsCount),
          results: polls.map((poll) => ({
            id: poll.id,
            user_id: poll.user_id,
            user_name: poll.user_name,
            profile_image_url: poll.profile_image_url,
            title: poll.title,
            description: poll.description,
            sharing_option: poll.sharing_option,
            is_active: poll.is_active,
            thumbnail: poll.thumbnail,
            content_list_id: poll.content_list_id,
            content_types: poll.content_types,
            created_at: poll.created_at,
            updated_at: poll.updated_at,
          })),
        },
        content_lists: {
          total_results: parseInt(contentListsCount),
          results: contentLists,
        },
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
