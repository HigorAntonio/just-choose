const isTypeValid = require('../utils/followedProfilePost/isTypeValid');
const getProfileFollowersIds = require('../utils/profileFollowers/getProfileFollowersIds');
const getProfileFollowingIds = require('../utils/profileFollowing/getProfileFollowingIds');
const getContentLists = require('../utils/contentList/getContentLists');
const getPolls = require('../utils/polls/getPolls');
const logger = require('../lib/logger');

module.exports = {
  async index(req, res) {
    try {
      const profileId = req.profileId;

      const { page = 1, page_size: pageSize = 15, type } = req.query;

      const errors = [];

      if (isNaN(page)) {
        errors.push('O parâmetro page deve ser um número');
      } else if (page < 1) {
        errors.push('O parâmetro page inválido. Min 1');
      }
      if (isNaN(pageSize)) {
        errors.push('O parâmetro page_size deve ser um número');
      } else if (pageSize < 1 || pageSize > 50) {
        errors.push('Parâmetro page_size inválido. Min 1, Max 50');
      }
      if (type) {
        if (typeof type !== 'string') {
          errors.push('O parâmetro type deve ser uma string');
        } else if (!isTypeValid(type)) {
          errors.push('Parâmetro type, valor inválido');
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({ messages: errors });
      }

      const followersIds = await getProfileFollowersIds(profileId);
      const followingIds = await getProfileFollowingIds(profileId);

      const { polls, count: pollsCount } =
        !type || type === 'poll'
          ? await getPolls({
              followersIds,
              followingIds,
              pageSize,
              page,
              sortBy: 'updated_at DESC',
            })
          : { polls: [], count: 0 };

      const { contentLists, count: contentListsCount } =
        !type || type === 'content_list'
          ? await getContentLists({
              followersIds,
              followingIds,
              pageSize,
              page,
              sortBy: 'updated_at DESC',
            })
          : { contentLists: [], count: 0 };

      const results = type ? [] : {};

      if (!type) {
        results.polls = {
          total_results: pollsCount,
          results: polls,
        };
        results.content_lists = {
          total_results: contentListsCount,
          results: contentLists,
        };
      }
      if (type === 'content_list') {
        results.push(...contentLists);
      }
      if (type === 'poll') {
        results.push(...polls);
      }

      const totalResults = contentListsCount + pollsCount;
      const totalPages = Math.ceil(
        Math.max(contentListsCount, pollsCount) / pageSize
      );
      return res.json({
        page: parseInt(page),
        page_size: parseInt(pageSize),
        total_pages: totalPages === 0 ? 1 : totalPages,
        total_results: totalResults,
        results,
      });
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },
};
