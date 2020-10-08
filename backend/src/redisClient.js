const redis = require('redis');

const client = redis.createClient();

client.on('connect', () => {
  console.log('Conectado ao Redis...');
});

client.on('error', (err) => {
  console.log('Redis erro: ' + err);
});

module.exports = client;