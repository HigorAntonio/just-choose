const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

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

const storeInSetInMemory = async (key, value) => {
  return await redisClient.sadd(key, value);
};

const isInSetInMemory = async (key, value) => {
  return await redisClient.sismember(key, value);
};

const isInHashInMemory = async (key, value) => {
  const vals = await redisClient.hvals(key);
  return vals.includes(value);
};

const removeFromSetInMemory = async (key, value) => {
  return (await redisClient.srem(key, value)) !== 0;
};

const getSetMembersFromMemory = async (key) => {
  return await redisClient.smembers(key);
};

const getHashMembersFromMemory = async (key) => {
  return await redisClient.hgetall(key);
};

exports.storeRefreshToken = async (profileId, refreshToken, device) => {
  const fieldId = uuidv4();
  const [[, setRefreshTokenStatus], [, setDeviceStatus]] = await redisClient
    .multi()
    .hset(
      `localAuth:profile:${profileId}`,
      `refreshToken:${fieldId}`,
      refreshToken
    )
    .hset(
      `localAuth:profile:${profileId}`,
      `device:${fieldId}`,
      JSON.stringify(device)
    )
    .exec();
  return !!(setRefreshTokenStatus && setDeviceStatus);
};

exports.isRefreshTokenInStorage = (profileId, refreshToken) => {
  return isInHashInMemory(`localAuth:profile:${profileId}`, refreshToken);
};

exports.getRefreshTokenFromStorage = async (profileId, deviceId) => {
  const hashMembers = await getHashMembersFromMemory(
    `localAuth:profile:${profileId}`
  );
  return Object.keys(hashMembers)
    .filter((key) => key.includes('refreshToken'))
    .map((key) => {
      const [, id] = key.split(':');
      return { id, refreshToken: hashMembers[key] };
    })
    .find((refreshToken) => refreshToken.id === deviceId);
};

exports.getDevicesFromStorage = async (profileId) => {
  const hashMembers = await getHashMembersFromMemory(
    `localAuth:profile:${profileId}`
  );
  return Object.keys(hashMembers)
    .filter((key) => key.includes('device'))
    .map((key) => {
      const [, id] = key.split(':');
      return { id, device: JSON.parse(hashMembers[key]) };
    });
};

exports.removeRefreshTokenFromStorage = async (profileId, refreshToken) => {
  const refreshTokens = await getHashMembersFromMemory(
    `localAuth:profile:${profileId}`
  );
  const hashField = Object.keys(refreshTokens).find(
    (key) => refreshTokens[key] === refreshToken
  );
  const [, fieldId] = hashField ? hashField.split(':') : [];
  if (!fieldId) {
    return false;
  }
  const [[, delRefreshTokenStatus], [, delDeviceStatus]] = await redisClient
    .multi()
    .hdel(`localAuth:profile:${profileId}`, `refreshToken:${fieldId}`)
    .hdel(`localAuth:profile:${profileId}`, `device:${fieldId}`)
    .exec();
  return !!(delRefreshTokenStatus && delDeviceStatus);
};

exports.storeForgotPasswordToken = (profileId, forgotPasswordToken) => {
  return storeInSetInMemory(
    `localAuth:profile:${profileId}:forgotPasswordTokens`,
    forgotPasswordToken
  );
};

exports.isForgotPasswordTokenInStorage = (profileId, forgotPasswordToken) => {
  return isInSetInMemory(
    `localAuth:profile:${profileId}:forgotPasswordTokens`,
    forgotPasswordToken
  );
};

exports.getForgotPasswordTokensFromStorage = (profileId) => {
  return getSetMembersFromMemory(
    `localAuth:profile:${profileId}:forgotPasswordTokens`
  );
};

exports.removeForgotPasswordTokenFromStorage = (
  profileId,
  forgotPasswordToken
) => {
  return removeFromSetInMemory(
    `localAuth:profile:${profileId}:forgotPasswordTokens`,
    forgotPasswordToken
  );
};
