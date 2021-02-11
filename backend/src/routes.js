const express = require('express');

const authorization = require('./middlewares/authorizationMiddleware');
const LocalAuthController = require('./controllers/LocalAuthController');
const PollController = require('./controllers/PollController');
const ContentListController = require('./controllers/ContentListController');
const ContentListTypesController = require('./controllers/ContentListTypesController');

const routes = express.Router();

routes.post('/signup', LocalAuthController.signup);
routes.post('/signin', LocalAuthController.signin);
routes.post('/token', LocalAuthController.refreshToken);
routes.delete('/logout', authorization, LocalAuthController.logout);

routes.post('/polls', authorization, PollController.create);
routes.get('/polls', authorization, PollController.index);
routes.put('/polls/:id', authorization, PollController.update);
routes.delete('/polls/:id', authorization, PollController.delete);

routes.post('/contentlists', authorization, ContentListController.create);
routes.get('/contentlists', ContentListController.index);
routes.get('/contentlists/:id', ContentListController.show);
routes.put('/contentlists/:id', authorization, ContentListController.update);
routes.delete('/contentlists/:id', authorization, ContentListController.delete);

routes.put(
  '/contentlists/contenttypes/:id',
  authorization,
  ContentListTypesController.update
);

routes.get('/', authorization, (req, res) => {
  res.json({ home: true });
});

module.exports = routes;
