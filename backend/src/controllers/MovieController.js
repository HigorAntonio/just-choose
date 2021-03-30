const { promisify } = require('util');

const validateDiscoverMovieParams = require('../utils/validation/tmdbApi/discoverMovieValidation');
const searchMovieValidation = require('../utils/validation/tmdbApi/searchMovieValidation');
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

      const { params, errors } = validateDiscoverMovieParams(queryParams);
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const url = `/discover/movie`;
      const key = url + JSON.stringify(params);

      params.api_key = TMDB_API_KEY;
      params.language = 'pt-BR';
      params.include_adult = false;
      params.certification_country = 'BR';
      params.watch_region = 'BR';

      const responseData = await getAsync(key);
      if (!responseData) {
        const { data } = await tmdbApi.get(url, { params });

        await Queue.add('InsertMoviesOnDatabase', data);

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

      const { params, errors } = searchMovieValidation(queryParams);
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const url = `/search/movie`;
      const key = url + JSON.stringify(params);

      params.api_key = TMDB_API_KEY;
      params.language = 'pt-BR';
      params.include_adult = false;

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

  async certifications(req, res) {
    try {
      const url = `/certification/movie/list`;
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

  async genres(req, res) {
    try {
      const url = `/genre/movie/list`;
      const key = url;
      const params = { api_key: TMDB_API_KEY, language: 'pt-BR' };

      const responseData = await getAsync(key);
      if (!responseData) {
        const { data } = await tmdbApi(url, { params });

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
      { id: 2, name: 'Apple iTunes' },
      { id: 3, name: 'Google Play Movies' },
      { id: 47, name: 'Looke' },
      { id: 31, name: 'HBO Go' },
      { id: 229, name: 'Fox Play' },
      { id: 167, name: 'Claro Video' },
      { id: 227, name: 'TeleCine Play' },
      { id: 307, name: 'Globo Play' },
      { id: 228, name: 'Fox Premium' },
      { id: 350, name: 'Apple TV Plus' },
      { id: 484, name: 'NOW' },
      { id: 68, name: 'Microsoft Store' },
    ]);
  },
};
