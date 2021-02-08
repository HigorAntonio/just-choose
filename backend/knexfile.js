// Update with your config settings.
require('dotenv/config');
const path = require('path');

module.exports = {
  client: 'pg',
  connection: {
    database: 'just_choose',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
  },
};
