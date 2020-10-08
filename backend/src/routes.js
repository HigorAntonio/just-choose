const express = require('express');

const LocalAuthController = require('./controllers/LocalAuthController');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.json({ ok: true });
});

routes.post('/signup', LocalAuthController.create);

module.exports = routes;