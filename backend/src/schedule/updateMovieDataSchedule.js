const schedule = require('node-schedule');
const updateDbMovieData = require('../lib/JustWatchCrawler');

module.exports = () => {
  schedule.scheduleJob('0 0 */8 ? * *', async () => {
    await updateDbMovieData();
  });
}