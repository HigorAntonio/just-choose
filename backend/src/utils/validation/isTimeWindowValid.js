module.exports = (timeWindow) => {
  const timeWindowAllowedValues = ['hour', 'day', 'week', 'month', 'year'];

  return !!timeWindowAllowedValues.find((e) => e === timeWindow);
};
