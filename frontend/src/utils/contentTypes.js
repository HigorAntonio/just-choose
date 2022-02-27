const contentTypes = {
  validTypes: ['movie', 'show', 'game'],

  options: [
    { key: 'Todos', value: 'all' },
    { key: 'Filme', value: 'movie' },
    { key: 'Série', value: 'show' },
    { key: 'Jogo', value: 'game' },
  ],

  isValid: function (contentType) {
    return !!this.validTypes.find((type) => type === contentType);
  },

  getPosterUrl: function (content) {
    if (!content.poster_path) {
      return '';
    }
    if (content.type === 'game') {
      return content.poster_path.replace(
        'https://media.rawg.io/media',
        'https://media.rawg.io/media/resize/420/-'
      );
    }
    if (content.type === 'movie' || content.type === 'show') {
      return `${process.env.REACT_APP_TMDB_POSTER_URL}w185${content.poster_path}`;
    }
    return '';
  },

  getBaseUrl: function (type) {
    switch (type) {
      case 'movie':
        return process.env.REACT_APP_TMDB_MOVIE_URL;
      case 'show':
        return process.env.REACT_APP_TMDB_SHOW_URL;
      case 'game':
        return process.env.REACT_APP_RAWG_GAME_URL;
      default:
        return '';
    }
  },
};

export default contentTypes;
