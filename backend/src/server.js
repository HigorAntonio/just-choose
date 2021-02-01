require('dotenv/config')
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const updateMovieData = require('./schedule/updateMovieDataSchedule');

const app = express();

updateMovieData();

app.use(cors());

app.use(express.json());

app.use(routes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor executando na porta ${PORT}...`);
});