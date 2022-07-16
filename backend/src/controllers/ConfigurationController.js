const { tmdbApi } = require('../apis');
const redisClient = require('../lib/redisClient');
const logger = require('../lib/logger');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const API_CACHE_EXPIRATION_TIME = process.env.API_CACHE_EXPIRATION_TIME;

module.exports = {
  async tmdb(req, res) {
    try {
      const url = '/configuration';
      const key = url;

      const params = { api_key: TMDB_API_KEY };
      const responseData = await redisClient.get(key);
      if (!responseData) {
        const { data } = await tmdbApi.get(url, { params });

        await redisClient.set(
          key,
          JSON.stringify(data),
          'EX',
          API_CACHE_EXPIRATION_TIME
        );
        return res.json(data);
      }

      return res.json(JSON.parse(responseData));
    } catch (error) {
      logger.error(error);
      return res.sendStatus(500);
    }
  },
};
