const isTypeValid = require('../utils/search/isTypeValid');
const getSearchOrderByQuery = require('../utils/search/getSearchOrderByQuery');
const getProfileFollowersIds = require('../utils/profileFollowers/getProfileFollowersIds');
const getProfiles = require('../utils/profiles/getProfiles');
const getPolls = require('../utils/polls/getPolls');
const getContentLists = require('../utils/contentList/getContentLists');
const logger = require('../lib/logger');

module.exports = {
  async index(req, res) {
    try {
      const profileId = req.profileId;

      const {
        page = 1,
        page_size: pageSize = 10,
        query,
        type,
        sort_by: sortBy,
      } = req.query;

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
      if (sortBy) {
        if (!isTypeValid(type)) {
          errors.push(
            'O parâmetro sort_by só pode ser usado com um parâmetro type válido'
          );
        } else if (typeof sortBy !== 'string') {
          errors.push('O parâmetro sort_by deve ser uma string');
        } else if (!getSearchOrderByQuery(type, sortBy)) {
          errors.push('Parâmetro sort_by, valor inválido');
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({ messages: errors });
      }

      const { profiles, count: profilesCount } =
        !type || type === 'profile'
          ? await getProfiles({
              pageSize,
              page,
              query,
              sortBy: sortBy
                ? getSearchOrderByQuery(type, sortBy)
                : 'followers_count DESC',
            })
          : { profiles: [], count: 0 };

      const followersIds = await getProfileFollowersIds(profileId);

      const { polls, count: pollsCount } =
        !type || type === 'poll'
          ? await getPolls({
              followersIds,
              pageSize,
              page,
              query,
              sortBy: sortBy
                ? getSearchOrderByQuery(type, sortBy)
                : 'updated_at DESC',
            })
          : { polls: [], count: 0 };

      const { contentLists, count: contentListsCount } =
        !type || type === 'content_list'
          ? await getContentLists({
              followersIds,
              pageSize,
              page,
              query,
              sortBy: sortBy
                ? getSearchOrderByQuery(type, sortBy)
                : 'likes DESC',
            })
          : { contentLists: [], count: 0 };

      const results = type ? [] : {};

      if (!type) {
        results.profiles = {
          total_results: profilesCount,
          results: profiles,
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
        results.push(...profiles);
      }
      if (type === 'content_list') {
        results.push(...contentLists);
      }
      if (type === 'poll') {
        results.push(...polls);
      }

      const totalResults = profilesCount + pollsCount + contentListsCount;
      const totalPages = Math.ceil(
        Math.max(profilesCount, pollsCount, contentListsCount) / pageSize
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
