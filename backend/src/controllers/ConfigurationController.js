const { promisify } = require('util');

const { tmdbApi } = require('../apis');
const redisClient = require('../lib/redisClient');

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const API_CACHE_EXPIRATION_TIME = process.env.API_CACHE_EXPIRATION_TIME;

module.exports = {
  async tmdb(req, res) {
    try {
      const url = '/configuration';
      const key = url;

      const params = { api_key: TMDB_API_KEY };
      const responseData = await getAsync(key);
      if (!responseData) {
        const { data } = await tmdbApi.get(url, { params });

        await setAsync(
          key,
          JSON.stringify(data),
          'EX',
          API_CACHE_EXPIRATION_TIME
        );
        return res.json(data);
      }

      return res.json(JSON.parse(responseData));
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
