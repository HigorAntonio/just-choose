const redis = require('redis');
const config = require('../config/redis');

const client = redis.createClient(config);

client.on('connect', () => {
  console.log('Conectado ao Redis...');
});

client.on('error', (err) => {
  console.log('Redis erro: ' + err);
});

module.exports = client;
