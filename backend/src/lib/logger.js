const pino = require('pino');
const config = require('../config/pino');

const logger = pino(config);

module.exports = logger;
