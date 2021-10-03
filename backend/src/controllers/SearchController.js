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

      const { users, count: usersCount } = await getUsers(
        10,
        1,
        query,
        null,
        'followers DESC'
      );

      const usersWhoFollowMe = await getFollowingUsers(userId);
      const followMeIds = usersWhoFollowMe.map((u) => u.user_id);

      const { polls, count: pollsCount } = await getPolls(
        null,
        null,
        followMeIds,
        10,
        1,
        query,
        'updated_at DESC'
      );

      const { contentLists, count: contentListsCount } = await getContentLists(
        null,
        null,
        followMeIds,
        10,
        1,
        query,
        'likes DESC'
      );

      return res.json({
        profiles: {
          total_results: parseInt(usersCount),
          results: users,
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
          results: contentLists.map((list) => ({
            id: list.id,
            user_id: list.user_id,
            user_name: list.user_name,
            profile_image_url: list.profile_image_url,
            title: list.title,
            description: list.description,
            sharing_option: list.sharing_option,
            thumbnail: list.thumbnail,
            likes: parseInt(list.likes),
            forks: parseInt(list.forks),
            content_types: list.content_types,
            created_at: list.created_at,
            updated_at: list.updated_at,
          })),
        },
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
