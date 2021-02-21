const { promisify } = require('util');

const validateDiscoverMovieParams = require('../utils/validation/tmdbApi/discoverMovie');
const { tmdbApi } = require('../apis');
const { redisClient } = require('../server');

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const API_CACHE_EXPIRATION_TIME = process.env.API_CACHE_EXPIRATION_TIME;

module.exports = {
  async index(req, res) {
    try {
      const queryParams = req.query;
      const errors = validateDiscoverMovieParams(queryParams);
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }
      queryParams.language = 'pt-BR';
      queryParams.include_adult = false;

      const url = `/discover/movie?api_key=${TMDB_API_KEY}`;
      const key =
        url.replace(`api_key=${TMDB_API_KEY}`, 'api_key=TMDB_API_KEY') +
        JSON.stringify(queryParams);

      const responseData = await getAsync(key);
      if (!responseData) {
        console.log('Resposta solicitada a api');
        const { data } = await tmdbApi.get(url, { params: queryParams });
        await setAsync(
          key,
          JSON.stringify(data),
          'EX',
          API_CACHE_EXPIRATION_TIME
        );

        return res.json(data);
      }

      console.log('Resposta vinda do cache');
      return res.json(JSON.parse(responseData));
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },
};
