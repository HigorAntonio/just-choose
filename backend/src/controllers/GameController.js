const validateGamesParams = require('../utils/validation/rawgApi/gamesValidation');
const { rawgApi } = require('../apis');
const Queue = require('../lib/Queue');
const redisClient = require('../lib/redisClient');
const logger = require('../lib/logger');

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const API_CACHE_EXPIRATION_TIME = process.env.API_CACHE_EXPIRATION_TIME;

module.exports = {
  async index(req, res) {
    try {
      const queryParams = req.query;

      const { params, errors } = validateGamesParams(queryParams);
      if (errors.length > 0) {
        return res.status(400).json({ messages: errors });
      }

      const url = `/games`;
      const key = url + JSON.stringify(params);

      params.key = RAWG_API_KEY;

      const responseData = await redisClient.get(key);
      if (!responseData) {
        const { data } = await rawgApi.get(url, { params });
        data.next = !!data.next; // As urls (strings) em next e previous contém
        data.previous = !!data.previous; // a RAWG_API_KEY e não devem ser usadas

        await Queue.add('InsertGamesOnDatabase', data);

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

  async platforms(req, res) {
    try {
      const url = `/platforms`;
      const key = url;
      const params = { key: RAWG_API_KEY, page: 1 };

      const responseData = await redisClient.get(key);
      if (!responseData) {
        const data = { platforms: [] };
        while (true) {
          const { data: responseData } = await rawgApi.get(url, { params });
          const { results, next } = responseData;
          data.platforms = [...data.platforms, ...results];
          if (!next) {
            break;
          }
          params.page = params.page + 1;
        }

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

  async genres(req, res) {
    try {
      const url = `/genres`;
      const key = url;
      const params = { key: RAWG_API_KEY, ordering: 'name', page: 1 };

      const responseData = await redisClient.get(key);
      if (!responseData) {
        const data = { genres: [] };
        while (true) {
          const { data: responseData } = await rawgApi.get(url, { params });
          const { results, next } = responseData;
          data.genres = [...data.genres, ...results];
          if (!next) {
            break;
          }
          params.page = params.page + 1;
        }

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
