module.exports = (sortBy) => {
  const sortByAllowedValues = {
    'updated.asc': 'updated_at ASC',
    'updated.desc': 'updated_at DESC',
    'popularity.asc': 'forks ASC',
    'popularity.desc': 'forks DESC',
    'rating.asc': 'likes ASC',
    'rating.desc': 'likes DESC',
    'title.asc': 'title ASC',
    'title.desc': 'title DESC',
  };

  return sortByAllowedValues[sortBy];
};
