module.exports = (contentType) => {
  if (contentType === 'movie') {
    return 'tmdb_id';
  }
  if (contentType === 'show') {
    return 'tmdb_id';
  }
  if (contentType === 'game') {
    return 'rawg_id';
  }
};
