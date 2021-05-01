const express = require('express');
const multer = require('multer');

const multerConfig = require('./config/multer');

const authorization = require('./middlewares/authorizationMiddleware');
const isUserActive = require('./middlewares/isUserActiveMiddleware');
const getLoggedUserId = require('./middlewares/getLoggedUserId');
const LocalAuthController = require('./controllers/LocalAuthController');
const FollowUsersController = require('./controllers/FollowUsersController');
const PollController = require('./controllers/PollController');
const ContentListController = require('./controllers/ContentListController');
const ContentListForkController = require('./controllers/ContentListForkController');
const VoteController = require('./controllers/VoteController');
const PollVoteController = require('./controllers/PollVoteController');
const MovieController = require('./controllers/MovieController');
const ShowController = require('./controllers/ShowController');
const GameController = require('./controllers/GameController');
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

// FollowUsersController
routes.post(
  '/users/follow',
  authorization,
  isUserActive,
  FollowUsersController.create
);
routes.get('/profile/follows', authorization, FollowUsersController.index);
routes.delete(
  '/users/follow',
  authorization,
  isUserActive,
  FollowUsersController.delete
);

// ContentListController
routes.post(
  '/contentlists',
  authorization,
  isUserActive,
  multer(multerConfig).single('thumbnail'),
  ContentListController.create
);
routes.get('/contentlists', getLoggedUserId, ContentListController.index);
routes.get('/contentlists/:id', getLoggedUserId, ContentListController.show);
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

// ContentListForkController
routes.post(
  '/contentlists/fork/:id',
  authorization,
  isUserActive,
  ContentListForkController.create
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
routes.get('/shows/search', authorization, isUserActive, ShowController.search);
routes.get('/shows/genres', authorization, isUserActive, ShowController.genres);
routes.get(
  '/shows/watch_providers',
  authorization,
  isUserActive,
  ShowController.watchProviders
);

// GameController
routes.get('/games', authorization, isUserActive, GameController.index);
routes.get(
  '/games/platforms',
  authorization,
  isUserActive,
  GameController.platforms
);
routes.get('/games/genres', authorization, isUserActive, GameController.genres);

// ConfigurationController
routes.get('/configuration/tmdb', authorization, ConfigurationController.tmdb);

routes.get('/', authorization, (req, res) => {
  res.json({ home: true });
});

module.exports = routes;
