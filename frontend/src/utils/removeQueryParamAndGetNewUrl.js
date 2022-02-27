const removeQueryParamAndGetNewUrl = (pathname, queryParams, queryKey) => {
  delete queryParams[`${queryKey}`];

  const queryParamsKeys = Object.keys(queryParams);
  const queryParamsValues = Object.values(queryParams);

  const newPath = `${pathname}${queryParamsKeys
    .map((key, i) => {
      const value = queryParamsValues[i];

      return i === 0 ? `?${key}=${value}` : `&${key}=${value}`;
    })
    .join('')}`;
  console.debug('newPath:', newPath);
  return newPath;
};

export default removeQueryParamAndGetNewUrl;
