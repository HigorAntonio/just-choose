const axios = require('axios');

module.exports = axios.create({
  baseURL: process.env.TMDB_API_BASE_URL,
});
