module.exports = (queryParams) => {
  const {
    sort_by,
    page,
    certification_country,
    'certification.lte': certification_lte,
    'certification.gte': certification_gte,
    'primary_release_date.gte': primary_release_date_gte,
    'primary_release_date.lte': primary_release_date_lte,
    'vote_average.gte': vote_average_gte,
    'vote_average.lte': vote_average_lte,
    with_genres,
    'with_runtime.gte': with_runtime_gte,
    'with_runtime.lte': with_runtime_lte,
    with_watch_providers,
    watch_region,
  } = queryParams;

  const sort_by_allowed_values = [
    'popularity.asc',
    'popularity.desc',
    'release_date.asc',
    'release_date.desc',
    'revenue.asc',
    'revenue.desc',
    'primary_release_date.asc',
    'primary_release_date.desc',
    'original_title.asc',
    'original_title.desc',
    'vote_average.asc',
    'vote_average.desc',
    'vote_count.asc',
    'vote_count.desc',
  ];

  const errors = [];
  if (sort_by) {
    if (typeof sort_by !== 'string') {
      errors.push('Parâmetro sort_by, valor inválido');
    } else if (sort_by_allowed_values.indexOf(sort_by) === -1) {
      errors.push('Parâmetro sort_by, valor inválido');
    }
  }
  if (page) {
    if (isNaN(page)) {
      errors.push('Parâmetro page, valor inválido');
    } else if (page < 1 || page > 100) {
      errors.push('Parâmetro page inválido. Min 1, Max 100');
    }
  }
  if (certification_country) {
    if (typeof certification_country !== 'string') {
      errors.push('Parâmetro certification_country, valor inválido');
    }
  }
  if (certification_lte) {
    if (typeof certification_lte !== 'string') {
      errors.push('Parâmetro certification.lte, valor iválido');
    }
  }
  if (certification_gte) {
    if (typeof certification_gte !== 'string') {
      errors.push('Parâmetro certification.gte, valor iválido');
    }
  }
  if (primary_release_date_gte) {
    if (typeof primary_release_date_gte !== 'string') {
      errors.push('Parâmetro primary_release_date.gte, valor inválido');
    }
  }
  if (primary_release_date_lte) {
    if (typeof primary_release_date_lte !== 'string') {
      errors.push('Parâmetro primary_release_date.lte, valor inválido');
    }
  }
  if (vote_average_gte) {
    if (isNaN(vote_average_gte)) {
      errors.push('Parâmetro vote_average.gte, valor inválido');
    } else if (vote_average_gte < 0) {
      errors.push('Parâmetro vote_average.gte, valor inválido. Min 0');
    }
  }
  if (vote_average_lte) {
    if (isNaN(vote_average_lte)) {
      errors.push('Parâmetro vote_average.lte, valor inválido');
    } else if (vote_average_lte < 0) {
      errors.push('Parâmetro vote_average.lte, valor inválido. Min 0');
    }
  }
  if (with_genres) {
    if (typeof with_genres !== 'string') {
      errors.push('Parâmetro with_genres, valor inválido');
    }
  }
  if (with_runtime_gte) {
    if (isNaN(with_runtime_gte)) {
      errors.push('Parâmetro with_runtime.gte, valor inválido');
    }
  }
  if (with_runtime_lte) {
    if (isNaN(with_runtime_lte)) {
      errors.push('Parâmetro with_runtime.lte, valor inválido');
    }
  }
  if (with_watch_providers) {
    if (typeof with_watch_providers !== 'string') {
      errors.push('Parâmetro with_watch_providers, valor inválido');
    }
  }
  if (watch_region) {
    if (typeof watch_region !== 'string') {
      errors.push('Parâmetro watch_region, valor inválido');
    }
  }

  const params = {
    sort_by,
    page,
    certification_country,
    certification_lte,
    certification_gte,
    primary_release_date_gte,
    primary_release_date_lte,
    vote_average_gte,
    vote_average_lte,
    with_genres,
    with_runtime_gte,
    with_runtime_lte,
    with_watch_providers,
    watch_region,
  };

  return { params, errors };
};
