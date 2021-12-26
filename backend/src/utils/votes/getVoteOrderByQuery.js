module.exports = (sortBy) => {
  const sortByAllowedValues = {
    'updated.asc': 'updated_at ASC',
    'updated.desc': 'updated_at DESC',
    'poll_title.asc': 'poll_title ASC',
    'poll_title.desc': 'poll_title DESC',
  };

  return sortByAllowedValues[sortBy];
};
