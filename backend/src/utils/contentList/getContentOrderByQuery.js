module.exports = (sortBy) => {
  const sortByAllowedValues = {
    'type.asc': 'type ASC',
    'type.desc': 'type DESC',
    'title.asc': 'title ASC',
    'title.desc': 'title DESC',
  };

  return sortByAllowedValues[sortBy];
};
