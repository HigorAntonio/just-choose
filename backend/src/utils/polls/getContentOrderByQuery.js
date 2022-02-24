module.exports = (sortBy) => {
  const sortByAllowedValues = {
    'type.asc': 'type ASC, title ASC',
    'type.desc': 'type DESC, title ASC',
    'title.asc': 'title ASC',
    'title.desc': 'title DESC',
    'votes.asc': 'votes ASC, title ASC',
    'votes.desc': 'votes DESC, title ASC',
  };

  return sortByAllowedValues[sortBy];
};
