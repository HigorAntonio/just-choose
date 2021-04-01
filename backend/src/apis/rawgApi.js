const axios = require('axios');

module.exports = axios.create({
  baseURL: process.env.RAWG_API_BASE_URL,
});
