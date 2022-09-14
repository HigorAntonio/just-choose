const express = require('express');
const multer = require('multer');

const multerConfig = require('./config/multer');

const authorization = require('./middlewares/authorizationMiddleware');
const isProfileActive = require('./middlewares/isProfileActiveMiddleware');
const getLoggedProfileId = require('./middlewares/getLoggedProfileIdMiddleware');
const ProfileController = require('./controllers/ProfileController');
const FollowProfilesController = require('./controllers/FollowProfilesController');
const ProfileFollowingController = require('./controllers/ProfileFollowingController');
const ProfileFollowersController = require('./controllers/ProfileFollowersController');
const PollController = require('./controllers/PollController');
const PollContentController = require('./controllers/PollContentController');
const ContentListController = require('./controllers/ContentListController');
const ContentListContentController = require('./controllers/ContentListContentController');
const ContentListLikeController = require('./controllers/ContentListLikeController');
const ContentListForkController = require('./controllers/ContentListForkController');
const VoteController = require('./controllers/VoteController');
const MovieController = require('./controllers/MovieController');
const ShowController = require('./controllers/ShowController');
const GameController = require('./controllers/GameController');
const SearchController = require('./controllers/SearchController');
const TrendingController = require('./controllers/TrendingController');
const FollowedProfilePostController = require('./controllers/FollowedProfilePostController');
const ConfigurationController = require('./controllers/ConfigurationController');

const routes = express.Router();

// LocalAuth
routes.post(
  '/signup',
  require('./useCases/signUpLocalProfile/signUpLocalProfileController')
);
routes.post(
  '/signin',
  require('./useCases/signInLocalProfile/signInLocalProfileController')
);
routes.post(
  '/token',
  require('./useCases/refreshAuthTokenLocalProfile/refreshAuthTokenLocalProfileController')
);
routes.delete(
  '/logout',
  authorization,
  require('./useCases/logoutLocalProfile/logoutLocalProfileController')
);
routes.post(
  '/forgotpassword',
  require('./useCases/forgotPasswordLocalProfile/forgotPasswordLocalProfileController')
);
routes.patch(
  '/resetpassword',
  require('./useCases/resetPasswordLocalProfile/resetPasswordLocalProfileController')
);
routes.get(
  '/devices',
  authorization,
  require('./useCases/devicesLocalProfile/devicesLocalProfileController')
);
routes.delete(
  '/devices',
  authorization,
  require('./useCases/exitDeviceLocalProfile/exitDeviceLocalProfileController')
);
routes.patch(
  '/confirmation/:token',
  require('./useCases/confirmEmailLocalProfile/confirmEmailLocalProfileController')
);
routes.get(
  '/confirmation',
  authorization,
  require('./useCases/resendConfirmEmailLocalProfile/resendConfirmEmailLocalProfileController')
);
routes.patch(
  '/updatepassword',
  authorization,
  require('./useCases/updatePasswordLocalProfile/updatePasswordLocalProfileController')
);

// ProfileController
routes.get('/profiles', getLoggedProfileId, ProfileController.index);
routes.get('/profiles/:name', getLoggedProfileId, ProfileController.show);
routes.put(
  '/profiles',
  authorization,
  multer(multerConfig).single('profile_image'),
  ProfileController.update
);

// FollowProfilesController
routes.post(
  '/profiles/follow',
  authorization,
  isProfileActive,
  FollowProfilesController.create
);
routes.delete(
  '/profiles/follow',
  authorization,
  isProfileActive,
  FollowProfilesController.delete
);

// ProfileFollowingController
routes.get(
  '/profiles/:id/following',
  getLoggedProfileId,
  ProfileFollowingController.index
);
routes.get(
  '/profiles/following/:id',
  authorization,
  isProfileActive,
  ProfileFollowingController.show
);

// ProfileFollowersController
routes.get(
  '/profiles/:id/followers',
  getLoggedProfileId,
  ProfileFollowersController.index
);
routes.get(
  '/profiles/followers/:id',
  authorization,
  ProfileFollowersController.show
);

// ContentListController
routes.post(
  '/contentlists',
  authorization,
  isProfileActive,
  multer(multerConfig).single('thumbnail'),
  ContentListController.create
);
routes.get('/contentlists', getLoggedProfileId, ContentListController.index);
routes.get('/contentlists/:id', getLoggedProfileId, ContentListController.show);
routes.put(
  '/contentlists/:id',
  authorization,
  isProfileActive,
  multer(multerConfig).single('thumbnail'),
  ContentListController.update
);
routes.delete(
  '/contentlists/:id',
  authorization,
  isProfileActive,
  ContentListController.delete
);

// ContentListContentController
routes.get(
  '/contentlists/:id/content',
  getLoggedProfileId,
  ContentListContentController.index
);

// ContentListLikeController
routes.post(
  '/contentlists/:id/like',
  authorization,
  isProfileActive,
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
  isProfileActive,
  ContentListLikeController.delete
);

// ContentListForkController
routes.post(
  '/contentlists/:id/fork',
  authorization,
  isProfileActive,
  ContentListForkController.create
);

// PollController
routes.post(
  '/polls',
  authorization,
  isProfileActive,
  multer(multerConfig).single('thumbnail'),
  PollController.create
);
routes.get('/polls', getLoggedProfileId, PollController.index);
routes.get('/polls/:id', getLoggedProfileId, PollController.show);
routes.put(
  '/polls/:id',
  authorization,
  isProfileActive,
  multer(multerConfig).single('thumbnail'),
  PollController.update
);
routes.delete(
  '/polls/:id',
  authorization,
  isProfileActive,
  PollController.delete
);

// PollContentController
routes.get(
  '/polls/:id/content',
  getLoggedProfileId,
  PollContentController.index
);

// VoteController
routes.post(
  '/polls/:id/votes',
  authorization,
  isProfileActive,
  VoteController.create
);
routes.get('/profiles/:id/votes', getLoggedProfileId, VoteController.index);
routes.get('/polls/:id/votes', authorization, VoteController.show);
routes.delete(
  '/polls/:id/votes',
  authorization,
  isProfileActive,
  VoteController.delete
);

// MovieController
routes.get('/movies', authorization, isProfileActive, MovieController.index);
routes.get(
  '/movies/search',
  authorization,
  isProfileActive,
  MovieController.search
);
routes.get(
  '/movies/certifications',
  authorization,
  isProfileActive,
  MovieController.certifications
);
routes.get(
  '/movies/genres',
  authorization,
  isProfileActive,
  MovieController.genres
);
routes.get(
  '/movies/watch_providers',
  authorization,
  isProfileActive,
  MovieController.watchProviders
);

// ShowController
routes.get('/shows', authorization, isProfileActive, ShowController.index);
routes.get(
  '/shows/search',
  authorization,
  isProfileActive,
  ShowController.search
);
routes.get(
  '/shows/genres',
  authorization,
  isProfileActive,
  ShowController.genres
);
routes.get(
  '/shows/watch_providers',
  authorization,
  isProfileActive,
  ShowController.watchProviders
);

// GameController
routes.get('/games', authorization, isProfileActive, GameController.index);
routes.get(
  '/games/platforms',
  authorization,
  isProfileActive,
  GameController.platforms
);
routes.get(
  '/games/genres',
  authorization,
  isProfileActive,
  GameController.genres
);

// SearchController
routes.get('/search', getLoggedProfileId, SearchController.index);

// TrendingController
routes.get('/trending', TrendingController.index);

// FollowedProfilePostController
routes.get(
  '/following',
  authorization,
  isProfileActive,
  FollowedProfilePostController.index
);

// ConfigurationController
routes.get('/configuration/tmdb', authorization, ConfigurationController.tmdb);

module.exports = routes;
