const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const redisClient = require('../lib/redisClient');

const APP_URL = process.env.APP_URL;
const CONFIRM_EMAIL_TOKEN_SECRET = process.env.CONFIRM_EMAIL_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRATION_TIME = process.env.REFRESH_TOKEN_EXPIRATION_TIME;
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
  const payload = {
    iss: APP_URL,
    sub: profileId,
    jti: randomUUID(),
  };
  const emailConfirmationToken = jwt.sign(payload, CONFIRM_EMAIL_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  await Queue.add('ConfirmationMail', { email, emailConfirmationToken });
};

exports.generateAccessToken = (profileId) => {
  const payload = {
    iss: APP_URL,
    sub: profileId,
    jti: randomUUID(),
  };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

exports.generateRefreshToken = (profileId) => {
  const payload = {
    iss: APP_URL,
    sub: profileId,
    jti: randomUUID(),
  };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });
};

exports.generateForgotPasswordToken = (profileId) => {
  const payload = {
    iss: APP_URL,
    sub: profileId,
    jti: randomUUID(),
  };
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

const getHashFieldId = async (key, value) => {
  const refreshTokens = await getHashMembersFromMemory(key);
  const hashField = Object.keys(refreshTokens).find(
    (key) => refreshTokens[key] === value
  );
  const [, fieldId] = hashField ? hashField.split(':') : [];
  return fieldId;
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
  const fieldId = randomUUID();
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
      return { id, ...JSON.parse(hashMembers[key]) };
    });
};

exports.updateRefreshTokenInStorage = async (
  profileId,
  currentRefreshToken,
  newRefreshToken,
  device
) => {
  const fieldId = await getHashFieldId(
    `localAuth:profile:${profileId}`,
    currentRefreshToken
  );
  if (!fieldId) {
    return false;
  }
  const [
    [, delRefreshTokenStatus],
    [, delDeviceStatus],
    [, setRefreshTokenStatus],
    [, setDeviceStatus],
  ] = await redisClient
    .multi()
    .hdel(`localAuth:profile:${profileId}`, `refreshToken:${fieldId}`)
    .hdel(`localAuth:profile:${profileId}`, `device:${fieldId}`)
    .hset(
      `localAuth:profile:${profileId}`,
      `refreshToken:${fieldId}`,
      newRefreshToken
    )
    .hset(
      `localAuth:profile:${profileId}`,
      `device:${fieldId}`,
      JSON.stringify(device)
    )
    .exec();
  return !!(
    delRefreshTokenStatus &&
    delDeviceStatus &&
    setRefreshTokenStatus &&
    setDeviceStatus
  );
};

exports.clearExpiredRefreshTokensFromStorage = async (profileId) => {
  const hashMembers = await getHashMembersFromMemory(
    `localAuth:profile:${profileId}`
  );
  const fieldIds = [
    ...new Set(Object.keys(hashMembers).map((key) => key.split(':')[1])),
  ];
  for (const fieldId of fieldIds) {
    try {
      jwt.verify(hashMembers[`refreshToken:${fieldId}`], REFRESH_TOKEN_SECRET);
    } catch (error) {
      if (error.message === 'jwt expired') {
        const [[, delRefreshTokenStatus], [, delDeviceStatus]] =
          await redisClient
            .multi()
            .hdel(`localAuth:profile:${profileId}`, `refreshToken:${fieldId}`)
            .hdel(`localAuth:profile:${profileId}`, `device:${fieldId}`)
            .exec();
        if (!(delRefreshTokenStatus && delDeviceStatus)) {
          throw new Error('error removing expired refresh tokens from storage');
        }
      }
    }
  }
};

exports.removeRefreshTokenFromStorage = async (profileId, refreshToken) => {
  const fieldId = await getHashFieldId(
    `localAuth:profile:${profileId}`,
    refreshToken
  );
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
