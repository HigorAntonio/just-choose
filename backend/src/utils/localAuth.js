const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redisClient = require('../lib/redisClient');

const CONFIRM_EMAIL_TOKEN_SECRET = process.env.CONFIRM_EMAIL_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const FORGOT_PASSWORD_TOKEN_SECRET = process.env.FORGOT_PASSWORD_TOKEN_SECRET;
const FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME =
  process.env.FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME;

exports.encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

exports.comparePassword = (password, hashed) => {
  return bcrypt.compareSync(password, hashed);
};

exports.sendEmailConfirmation = async (profileId, email, Queue) => {
  const emailConfirmationToken = jwt.sign(
    { id: profileId },
    CONFIRM_EMAIL_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  await Queue.add('ConfirmationMail', { email, emailConfirmationToken });
};

exports.generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET);
};

exports.generateForgotPasswordToken = (payload) => {
  return jwt.sign(payload, FORGOT_PASSWORD_TOKEN_SECRET, {
    expiresIn: FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME,
  });
};

exports.verifyRefreshToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error('invalid "refresh_token"');
  }
};

exports.verifyForgotPasswordToken = (forgotPasswordToken) => {
  try {
    return jwt.verify(forgotPasswordToken, FORGOT_PASSWORD_TOKEN_SECRET);
  } catch (error) {
    throw new Error('invalid "forgot_password_token"');
  }
};

const storeInMemory = async (key, value) => {
  return await redisClient.sadd(key, value);
};

const isInMemory = async (key, value) => {
  return await redisClient.sismember(key, value);
};

const removeFromMemory = async (key, value) => {
  return (await redisClient.srem(key, value)) !== 0;
};

const getSetMembersFromMemory = async (key) => {
  return await redisClient.smembers(key);
};

exports.storeRefreshToken = (profileId, refreshToken) => {
  return storeInMemory(`localAuth:refreshTokens:${profileId}`, refreshToken);
};

exports.isRefreshTokenInStorage = (profileId, refreshToken) => {
  return isInMemory(`localAuth:refreshTokens:${profileId}`, refreshToken);
};

exports.getRefreshTokensFromStorage = (profileId) => {
  return getSetMembersFromMemory(`localAuth:refreshTokens:${profileId}`);
};

exports.removeRefreshTokenFromStorage = (profileId, refreshToken) => {
  return removeFromMemory(`localAuth:refreshTokens:${profileId}`, refreshToken);
};

exports.storeForgotPasswordToken = (profileId, forgotPasswordToken) => {
  return storeInMemory(
    `localAuth:forgotPasswordTokens:${profileId}`,
    forgotPasswordToken
  );
};

exports.isForgotPasswordTokenInStorage = (profileId, forgotPasswordToken) => {
  return isInMemory(
    `localAuth:forgotPasswordTokens:${profileId}`,
    forgotPasswordToken
  );
};

exports.getForgotPasswordTokensFromStorage = (profileId) => {
  return getSetMembersFromMemory(`localAuth:forgotPasswordTokens:${profileId}`);
};

exports.removeForgotPasswordTokenFromStorage = (
  profileId,
  forgotPasswordToken
) => {
  return removeFromMemory(
    `localAuth:forgotPasswordTokens:${profileId}`,
    forgotPasswordToken
  );
};
