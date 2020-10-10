const express = require('express');

const authorization = require('./middlewares/authorizationMiddleware');
const LocalAuthController = require('./controllers/LocalAuthController');
const PollController = require('./controllers/PollController');

const routes = express.Router();

routes.post('/signup', LocalAuthController.signup);
routes.post('/signin', LocalAuthController.signin);
routes.post('/token', LocalAuthController.refreshToken);
routes.delete('/logout', authorization, LocalAuthController.logout);

routes.post('/polls', authorization, PollController.create);
routes.get('/polls', authorization, PollController.index);
routes.put('/polls/:id', authorization, PollController.update);
routes.delete('/polls/:id', authorization, PollController.delete);

routes.get('/', authorization, (req, res) => {
  res.json({ home: true });
});

module.exports = routes;