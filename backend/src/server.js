const app = require('./app');
const logger = require('./lib/logger');

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}...`);
});
