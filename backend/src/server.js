require('dotenv/config');
const express = require('express');
const cors = require('cors');
const path = require('path');

const updateMovieData = require('./schedule/updateMovieDataSchedule');

module.exports.redisClient = require('./lib/redisClient');

const app = express();

updateMovieData();

app.use(cors());

app.use(express.json());

app.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);

app.use(require('./routes'));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor executando na porta ${PORT}...`);
});
