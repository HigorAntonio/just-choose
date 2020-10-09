const express = require('express');

const authorization = require('./middlewares/authorizationMiddleware');
const LocalAuthController = require('./controllers/LocalAuthController');

const routes = express.Router();

routes.post('/signup', LocalAuthController.signup);
routes.post('/signin', LocalAuthController.signin);
routes.post('/token', LocalAuthController.refreshToken);
routes.delete('/logout', authorization, LocalAuthController.logout);

routes.get('/', authorization, (req, res) => {
  res.json({ home: true });
});

module.exports = routes;