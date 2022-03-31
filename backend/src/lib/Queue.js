const Queue = require('bull');
const redisConfig = require('../config/redis');
const logger = require('./logger');

const jobs = require('../jobs');

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, { redis: redisConfig }),
  name: job.key,
  handle: job.handle,
}));

module.exports = {
  queues,
  add(name, data) {
    const queue = this.queues.find((queue) => queue.name === name);

    return queue.bull.add(data);
  },
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job, err) => {
        logger.error('Job failed', queue.key, job.data, err);
      });
    });
  },
  close() {
    return this.queues.forEach((queue) => {
      queue.bull.close();
    });
  },
};
