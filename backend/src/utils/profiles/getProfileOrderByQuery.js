module.exports = (sortBy) => {
  const sortByAllowedValues = {
    'name.asc': 'name ASC',
    'name.desc': 'name DESC',
    'followers.asc': 'followers_count ASC',
    'followers.desc': 'followers_count DESC',
  };

  return sortByAllowedValues[sortBy];
};
