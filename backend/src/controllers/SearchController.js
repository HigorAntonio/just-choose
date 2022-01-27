const isTypeValid = require('../utils/search/isTypeValid');
const getUserFollowersIds = require('../utils/userFollowers/getUserFollowersIds');
const getUsers = require('../utils/users/getUsers');
const getPolls = require('../utils/polls/getPolls');
const getContentLists = require('../utils/contentList/getContentLists');

module.exports = {
  async index(req, res) {
    try {
      const userId = req.userId;

      const { page = 1, page_size: pageSize = 10, query, type } = req.query;

      const errors = [];

      if (isNaN(page)) {
        errors.push('O parâmetro page deve ser um número');
      } else if (page < 1) {
        errors.push('O parâmetro page inválido. Min 1');
      }
      if (isNaN(pageSize)) {
        errors.push('O parâmetro page_size deve ser um número');
      } else if (pageSize < 1 || pageSize > 30) {
        errors.push('Parâmetro page_size inválido. Min 1, Max 30');
      }
      if (!query) {
        errors.push({ erro: 'Parâmetro query não informado' });
      } else if (typeof query !== 'string') {
        errors.push({ erro: 'O parâmetro query deve ser uma string' });
      }
      if (type) {
        if (typeof type !== 'string') {
          errors.push('O parâmetro type deve ser uma string');
        } else if (!isTypeValid(type)) {
          errors.push('Parâmetro type, valor inválido');
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const { users, count: usersCount } =
        !type || type === 'profile'
          ? await getUsers({
              pageSize,
              page,
              query,
              sortBy: 'followers_count DESC',
            })
          : { users: [], count: 0 };

      const followersIds = await getUserFollowersIds(userId);

      const { polls, count: pollsCount } =
        !type || type === 'poll'
          ? await getPolls({
              followersIds,
              pageSize,
              page,
              query,
              sortBy: 'updated_at DESC',
            })
          : { polls: [], count: 0 };

      const { contentLists, count: contentListsCount } =
        !type || type === 'content_list'
          ? await getContentLists({
              followersIds,
              pageSize,
              page,
              query,
              sortBy: 'likes DESC',
            })
          : { contentLists: [], count: 0 };

      const results = type ? [] : {};

      if (!type) {
        results.profiles = {
          total_results: usersCount,
          results: users,
        };
        results.polls = {
          total_results: pollsCount,
          results: polls,
        };
        results.content_lists = {
          total_results: contentListsCount,
          results: contentLists,
        };
      }
      if (type === 'profile') {
        results.push(...users);
      }
      if (type === 'content_list') {
        results.push(...contentLists);
      }
      if (type === 'poll') {
        results.push(...polls);
      }

      const totalResults = usersCount + pollsCount + contentListsCount;
      const totalPages = Math.ceil(
        Math.max(usersCount, pollsCount, contentListsCount) / pageSize
      );
      return res.json({
        page: parseInt(page),
        page_size: parseInt(pageSize),
        total_pages: totalPages === 0 ? 1 : totalPages,
        total_results: totalResults,
        results,
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
