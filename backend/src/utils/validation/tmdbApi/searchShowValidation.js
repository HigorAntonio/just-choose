module.exports = (queryParams) => {
  const { query, page } = queryParams;

  const errors = [];

  if (!query) {
    errors.push('Parâmetro query não informado');
  } else if (typeof query !== 'string') {
    errors.push('Parâmetro query, valor inválido');
  }
  if (page) {
    if (isNaN(page)) {
      errors.push('Parâmetro page, valor inválido');
    } else if (page < 1 || page > 1000) {
      errors.push('Parâmetor page inválido. Min 1, Max 1000');
    }
  }

  const params = {};
  page && (params.page = page);
  query && (params.query = query);

  return { params, errors };
};
