module.exports = (sortBy) => {
  const sortByAllowedValues = {
    'updated.asc': 'updated_at ASC',
    'updated.desc': 'updated_at DESC',
    'title.asc': 'title ASC',
    'title.desc': 'title DESC',
    'votes.asc': 'total_votes ASC',
    'votes.desc': 'total_votes DESC',
  };

  return sortByAllowedValues[sortBy];
};
