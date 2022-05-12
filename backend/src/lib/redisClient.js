const Redis = require('ioredis');
const config = require('../config/redis');
const logger = require('./logger');

const redis = new Redis(config);

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('error', (err) => {
  logger.error('Redis error: ' + err);
});

redis.on('end', () => {
  logger.info('Disconnected from Redis');
});

redis.delKeys = async (pattern) => {
  for (const key of await redis.keys(pattern)) {
    await redis.del(key);
  }
};

module.exports = redis;
