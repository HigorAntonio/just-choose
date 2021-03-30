const express = require('express');
const multer = require('multer');

const multerConfig = require('./config/multer');

const authorization = require('./middlewares/authorizationMiddleware');
const isUserActive = require('./middlewares/isUserActive');
const LocalAuthController = require('./controllers/LocalAuthController');
const PollController = require('./controllers/PollController');
const ContentListController = require('./controllers/ContentListController');
const VoteController = require('./controllers/VoteController');
const PollVoteController = require('./controllers/PollVoteController');
const MovieController = require('./controllers/MovieController');
const ShowController = require('./controllers/ShowController');
const ConfigurationController = require('./controllers/ConfigurationController');

const routes = express.Router();

// LocalAuthController
routes.post('/signup', LocalAuthController.signup);
routes.post('/signin', LocalAuthController.signin);
routes.post('/token', LocalAuthController.refreshToken);
routes.delete('/logout', authorization, LocalAuthController.logout);
routes.post('/forgotpassword', LocalAuthController.forgotPassword);
routes.post('/resetpassword', LocalAuthController.resetPassword);
routes.get('/devices', authorization, LocalAuthController.userDevices);
routes.delete('/devices', authorization, LocalAuthController.exitDevice);
routes.patch('/confirmation/:token', LocalAuthController.confirmEmail);
routes.get(
  '/confirmation',
  authorization,
  LocalAuthController.resendConfirmEmail
);

// ContentListController
routes.post(
  '/contentlists',
  authorization,
  isUserActive,
  multer(multerConfig).single('thumbnail'),
  ContentListController.create
);
routes.get('/contentlists', ContentListController.index);
routes.get('/contentlists/:id', ContentListController.show);
routes.put(
  '/contentlists/:id',
  authorization,
  isUserActive,
  multer(multerConfig).single('thumbnail'),
  ContentListController.update
);
routes.delete(
  '/contentlists/:id',
  authorization,
  isUserActive,
  ContentListController.delete
);

// PollController
routes.post(
  '/polls',
  authorization,
  isUserActive,
  multer(multerConfig).single('thumbnail'),
  PollController.create
);
routes.get('/polls', PollController.index);
routes.get('/polls/:id', PollController.show);
routes.put(
  '/polls/:id',
  authorization,
  isUserActive,
  multer(multerConfig).single('thumbnail'),
  PollController.update
);
routes.delete('/polls/:id', authorization, isUserActive, PollController.delete);

// VoteController
routes.post(
  '/polls/:id/votes',
  authorization,
  isUserActive,
  VoteController.create
);
routes.delete(
  '/polls/:id/votes',
  authorization,
  isUserActive,
  VoteController.delete
);

// PollVoteController
routes.get('/polls/:id/result', PollVoteController.show);

// MovieController
routes.get('/movies', authorization, isUserActive, MovieController.index);
routes.get(
  '/movies/search',
  authorization,
  isUserActive,
  MovieController.search
);
routes.get(
  '/movies/certifications',
  authorization,
  isUserActive,
  MovieController.certifications
);
routes.get(
  '/movies/genres',
  authorization,
  isUserActive,
  MovieController.genres
);
routes.get(
  '/movies/watch_providers',
  authorization,
  isUserActive,
  MovieController.watchProviders
);

// ShowController
routes.get('/shows', authorization, isUserActive, ShowController.index);
routes.get('/shows/genres', authorization, isUserActive, ShowController.genres);
routes.get(
  '/shows/watch_providers',
  authorization,
  isUserActive,
  ShowController.watchProviders
);

// ConfigurationController
routes.get('/configuration/tmdb', authorization, ConfigurationController.tmdb);

routes.get('/', authorization, (req, res) => {
  res.json({ home: true });
});

module.exports = routes;
