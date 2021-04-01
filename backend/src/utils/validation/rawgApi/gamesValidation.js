module.exports = (queryParams) => {
  const {
    ordering,
    page,
    search,
    platforms,
    genres,
    dates,
    metacritic,
  } = queryParams;

  const ordering_allowed_values = [
    'name',
    'released',
    'added',
    'created',
    'updated',
    'rating',
    'metacritic',
  ];

  const errors = [];
  if (ordering) {
    if (typeof ordering !== 'string') {
      errors.push('Parâmetro ordering, valor inválido');
    } else if (ordering_allowed_values.indexOf(ordering) === -1) {
      errors.push('Parâmetro ordering, valor inválido');
    }
  }
  if (page) {
    if (isNaN(page)) {
      errors.push('Parâmetro page, valor inválido');
    } else if (page < 1 || page > 100) {
      errors.push('Parâmetro page inválido. Min 1, Max 100');
    }
  }
  if (search) {
    if (typeof search !== 'string') {
      errors.push('Parâmetro search, valor inválido');
    }
  }
  if (platforms) {
    if (typeof platforms !== 'string') {
      errors.push('Parâmetro platforms, valor inválido');
    }
  }
  if (genres) {
    if (typeof genres !== 'string') {
      errors.push('Parâmetro genres, valor inválido');
    }
  }
  if (dates) {
    if (typeof dates !== 'string') {
      errors.push('Parâmetro dates, valor inválido');
    }
  }
  if (metacritic) {
    if (typeof metacritic !== 'string') {
      errors.push('Parâmetro metacritic, valor inválido');
    }
  }

  const params = {};
  ordering && (params.ordering = ordering);
  page && (params.page = page);
  search && (params.search = search);
  platforms && (params.platforms = platforms);
  genres && (params.genres = genres);
  dates && (params.dates = dates);
  metacritic && (params.metacritic = metacritic);

  return { params, errors };
};
