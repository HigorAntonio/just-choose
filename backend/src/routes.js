const express = require('express');
const multer = require('multer');

const multerConfig = require('./config/multer');

const authorization = require('./middlewares/authorizationMiddleware');
const isUserActive = require('./middlewares/isUserActiveMiddleware');
const getLoggedUserId = require('./middlewares/getLoggedUserId');
const LocalAuthController = require('./controllers/LocalAuthController');
const UserController = require('./controllers/UserController');
const FollowUsersController = require('./controllers/FollowUsersController');
const UserFollowingController = require('./controllers/UserFollowingController');
const UserFollowersController = require('./controllers/UserFollowersController');
const PollController = require('./controllers/PollController');
const ContentListController = require('./controllers/ContentListController');
const ContentListLikeController = require('./controllers/ContentListLikeController');
const ContentListForkController = require('./controllers/ContentListForkController');
const VoteController = require('./controllers/VoteController');
const MovieController = require('./controllers/MovieController');
const ShowController = require('./controllers/ShowController');
const GameController = require('./controllers/GameController');
const SearchController = require('./controllers/SearchController');
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
routes.put(
  '/updatepassword',
  authorization,
  LocalAuthController.updatePassword
);

// UserController
routes.get('/users', getLoggedUserId, UserController.index);
routes.get('/users/:id', getLoggedUserId, UserController.show);
routes.put(
  '/users',
  authorization,
  multer(multerConfig).single('profile_image'),
  UserController.update
);

// FollowUsersController
routes.post(
  '/users/follow',
  authorization,
  isUserActive,
  FollowUsersController.create
);
routes.delete(
  '/users/follow',
  authorization,
  isUserActive,
  FollowUsersController.delete
);

// UserFollowingController
routes.get('/users/:id/following', UserFollowingController.index);
routes.get(
  '/users/following/:id',
  authorization,
  isUserActive,
  UserFollowingController.show
);

// UserFollowersController
routes.get('/users/:id/followers', UserFollowersController.index);

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

// ContentListLikeController
routes.post(
  '/contentlists/:id/like',
  authorization,
  isUserActive,
  ContentListLikeController.create
);
routes.get(
  '/contentlists/:id/like',
  authorization,
  ContentListLikeController.show
);
routes.delete(
  '/contentlists/:id/like',
  authorization,
  isUserActive,
  ContentListLikeController.delete
);

// ContentListForkController
routes.post(
  '/contentlists/:id/fork',
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
routes.get('/polls', getLoggedUserId, PollController.index);
routes.get('/polls/:id', getLoggedUserId, PollController.show);
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
routes.get('/polls/:id/votes', authorization, VoteController.show);
routes.delete(
  '/polls/:id/votes',
  authorization,
  isUserActive,
  VoteController.delete
);

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

// SearchController
routes.get('/search', getLoggedUserId, SearchController.index);

// ConfigurationController
routes.get('/configuration/tmdb', authorization, ConfigurationController.tmdb);

module.exports = routes;
