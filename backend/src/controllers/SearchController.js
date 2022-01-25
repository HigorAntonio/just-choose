const getUserFollowersIds = require('../utils/userFollowers/getUserFollowersIds');
const getUsers = require('../utils/users/getUsers');
const getPolls = require('../utils/polls/getPolls');
const getContentLists = require('../utils/contentList/getContentLists');

module.exports = {
  async index(req, res) {
    try {
      const userId = req.userId;

      const { page = 1, page_size: pageSize = 10, query } = req.query;

      const errors = [];

      if (isNaN(page)) {
        errors.push('O parâmetro page deve ser um número');
      } else if (page < 1) {
        errors.push('O parâmetro page inválido. Min 1');
      }
      if (isNaN(pageSize)) {
        errors.push('O parâmetro page_size deve ser um número');
      } else if (pageSize < 1 || pageSize > 100) {
        errors.push('Parâmetro page_size inválido. Min 1, Max 100');
      }
      if (!query) {
        errors.push({ erro: 'Parâmetro query não informado' });
      } else if (typeof query !== 'string') {
        errors.push({ erro: 'O parâmetro query deve ser uma string' });
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const { users, count: usersCount } = await getUsers({
        pageSize,
        page,
        query,
        sortBy: 'followers_count DESC',
      });

      const followersIds = await getUserFollowersIds(userId);

      const { polls, count: pollsCount } = await getPolls({
        followersIds,
        pageSize,
        page,
        query,
        sortBy: 'updated_at DESC',
      });

      const { contentLists, count: contentListsCount } = await getContentLists({
        followersIds,
        pageSize,
        page,
        query,
        sortBy: 'likes DESC',
      });

      return res.json({
        profiles: {
          total_results: usersCount,
          results: users,
        },
        polls: {
          total_results: pollsCount,
          results: polls,
        },
        content_lists: {
          total_results: contentListsCount,
          results: contentLists,
        },
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
