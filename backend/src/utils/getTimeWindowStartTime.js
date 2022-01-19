const dayjs = require('dayjs');

module.exports = (timeUnit) => {
  return dayjs().subtract(1, timeUnit).format();
};
