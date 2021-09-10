module.exports = (sortBy) => {
  const sortByAllowedValues = {
    'updated.asc': 'updated_at ASC',
    'updated.desc': 'updated_at DESC',
    'title.asc': 'title ASC',
    'title.desc': 'title DESC',
  };

  return sortByAllowedValues[sortBy];
};
