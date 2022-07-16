const getProfileOrderByQuery = require('../profiles/getProfileOrderByQuery');
const getPollOrderByQuery = require('../polls/getPollOrderByQuery');
const getListOrderByQuery = require('../contentList/getListOrderByQuery');

module.exports = (type, sortBy) => {
  if (type === 'profile') {
    return getProfileOrderByQuery(sortBy);
  }
  if (type === 'poll') {
    return getPollOrderByQuery(sortBy);
  }
  if (type === 'content_list') {
    return getListOrderByQuery(sortBy);
  }
  return undefined;
};
