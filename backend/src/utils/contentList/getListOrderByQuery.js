module.exports = (sort_by) => {
  const sort_by_allowed_values = {
    'updated.asc': 'updated_at ASC',
    'updated.desc': 'updated_at DESC',
    'popularity.asc': 'forks ASC',
    'popularity.desc': 'forks DESC',
    'rating.asc': 'likes ASC',
    'rating.desc': 'likes DESC',
    'title.asc': 'title ASC',
    'title.desc': 'title DESC',
  };

  return sort_by_allowed_values[sort_by];
};
