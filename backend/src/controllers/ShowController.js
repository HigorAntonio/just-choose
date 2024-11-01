const { promisify } = require('util');

const validateDiscoverShowParams = require('../utils/validation/tmdbApi/discoverShowValidation');
const validateSearchShowParams = require('../utils/validation/tmdbApi/searchShowValidation');
const { tmdbApi } = require('../apis');
const Queue = require('../lib/Queue');
const { redisClient } = require('../server');

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const API_CACHE_EXPIRATION_TIME = process.env.API_CACHE_EXPIRATION_TIME;

module.exports = {
  async index(req, res) {
    try {
      const queryParams = req.query;

      const { params, errors } = validateDiscoverShowParams(queryParams);
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const url = `/discover/tv`;
      const key = url + JSON.stringify(params);

      params.api_key = TMDB_API_KEY;
      params.language = 'pt-BR';
      params.watch_region = 'BR';

      const responseData = await getAsync(key);
      if (!responseData) {
        const { data } = await tmdbApi.get(url, { params });

        await Queue.add('InsertShowsOnDatabase', data);

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

  async search(req, res) {
    try {
      const queryParams = req.query;

      const { params, errors } = validateSearchShowParams(queryParams);
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const url = `/search/tv`;
      const key = url + JSON.stringify(params);

      params.api_key = TMDB_API_KEY;
      params.language = 'pt-BR';
      params.include_adult = false;

      const responseData = await getAsync(key);
      if (!responseData) {
        const { data } = await tmdbApi.get(url, { params });

        await Queue.add('InsertShowsOnDatabase', data);

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

  async genres(req, res) {
    try {
      const url = `/genre/tv/list`;
      const key = url;
      const params = { api_key: TMDB_API_KEY, language: 'pt-BR' };

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

  async watchProviders(req, res) {
    return res.json([
      { id: 8, name: 'Netflix' },
      { id: 119, name: 'Amazon Prime Video' },
      { id: 337, name: 'Disney Plus' },
      { id: 47, name: 'Looke' },
      { id: 31, name: 'HBO Go' },
      { id: 229, name: 'Fox Play' },
      { id: 167, name: 'Claro Video' },
      { id: 283, name: 'Crunchyroll' },
      { id: 307, name: 'Globo Play' },
      { id: 228, name: 'Fox Premium' },
      { id: 350, name: 'Apple TV Plus' },
      { id: 484, name: 'NOW' },
      { id: 68, name: 'Microsoft Store' },
    ]);
  },
};
