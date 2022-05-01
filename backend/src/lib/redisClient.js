const redis = require('redis');
const { promisify } = require('util');
const config = require('../config/redis');
const logger = require('./logger');

const client = redis.createClient(config);

client.on('connect', () => {
  logger.info('Connected to Redis');
});

client.on('error', (err) => {
  logger.error('Redis error: ' + err);
});

client.on('end', () => {
  logger.info('Disconnected from Redis');
});

client.delKeysAsync = async (pattern) => {
  const keysAsync = promisify(client.keys).bind(client);
  const delAsync = promisify(client.del).bind(client);

  for (const key of await keysAsync(pattern)) {
    await delAsync(key);
  }
};

client.saddAsync = promisify(client.sadd).bind(client);
client.sremAsync = promisify(client.srem).bind(client);
client.sismemberAsync = promisify(client.sismember).bind(client);
client.smembersAsync = promisify(client.smembers).bind(client);
client.flushdbAsync = promisify(client.flushdb).bind(client);
client.flushallAsync = promisify(client.flushall).bind(client);
client.quitAsync = promisify(client.quit).bind(client);

module.exports = client;
