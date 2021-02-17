const express = require('express');
const multer = require('multer');

const multerConfig = require('./config/multer');

const authorization = require('./middlewares/authorizationMiddleware');
const LocalAuthController = require('./controllers/LocalAuthController');
const PollController = require('./controllers/PollController');
const ContentListController = require('./controllers/ContentListController');
const ContentListTypesController = require('./controllers/ContentListTypesController');
const MovieVoteController = require('./controllers/MovieVoteController');
const PollVoteController = require('./controllers/PollVoteController');

const routes = express.Router();

routes.post('/signup', LocalAuthController.signup);
routes.post('/signin', LocalAuthController.signin);
routes.post('/token', LocalAuthController.refreshToken);
routes.delete('/logout', authorization, LocalAuthController.logout);
routes.post('/forgotpassword', LocalAuthController.forgotPassword);
routes.post('/resetpassword', LocalAuthController.resetPassword);
routes.get('/devices', authorization, LocalAuthController.userDevices);
routes.delete('/devices', authorization, LocalAuthController.exitDevice);

routes.post(
  '/contentlists',
  authorization,
  multer(multerConfig).single('thumbnail'),
  ContentListController.create
);
routes.get('/contentlists', ContentListController.index);
routes.get('/contentlists/:id', ContentListController.show);
routes.put(
  '/contentlists/:id',
  authorization,
  multer(multerConfig).single('thumbnail'),
  ContentListController.update
);
routes.delete('/contentlists/:id', authorization, ContentListController.delete);

routes.put(
  '/contentlists/contenttypes/:id',
  authorization,
  ContentListTypesController.update
);

routes.post(
  '/polls',
  authorization,
  multer(multerConfig).single('thumbnail'),
  PollController.create
);
routes.get('/polls', PollController.index);
routes.get('/polls/:id', PollController.show);
routes.put(
  '/polls/:id',
  authorization,
  multer(multerConfig).single('thumbnail'),
  PollController.update
);
routes.delete('/polls/:id', authorization, PollController.delete);

routes.post(
  '/polls/:id/votes/movie',
  authorization,
  MovieVoteController.create
);
routes.delete(
  '/polls/:id/votes/movie',
  authorization,
  MovieVoteController.delete
);

routes.get('/polls/:id/result', PollVoteController.show);

routes.get('/', authorization, (req, res) => {
  res.json({ home: true });
});

module.exports = routes;
