module.exports = (sortBy) => {
  const sortByAllowedValues = {
    'updated.asc': 'updated_at ASC',
    'updated.desc': 'updated_at DESC',
  };

  return sortByAllowedValues[sortBy];
};
