require('dotenv/config');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.json());

process.env.STORAGE_TYPE === 'local' &&
  app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
  );

app.use(require('./routes'));

module.exports = app;
