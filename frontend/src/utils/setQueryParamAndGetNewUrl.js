const setQueryParamAndGetNewUrl = (
  pathname,
  queryParams,
  queryKey,
  queryValue
) => {
  const queryParamsKeys = Object.keys(queryParams);
  const queryParamsValues = Object.values(queryParams);

  if (!queryParamsKeys.includes(queryKey)) {
    queryParamsKeys.push(queryKey);
    queryParamsValues.push(queryValue);
  }

  const newPath = `${pathname}${queryParamsKeys
    .map((key, i) => {
      const value = key === queryKey ? queryValue : queryParamsValues[i];

      return i === 0 ? `?${key}=${value}` : `&${key}=${value}`;
    })
    .join('')}`;
  return newPath;
};

export default setQueryParamAndGetNewUrl;
