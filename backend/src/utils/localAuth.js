const jwt = require('jsonwebtoken');

const Queue = require('../lib/Queue');

const CONFIRM_EMAIL_TOKEN_SECRET = process.env.CONFIRM_EMAIL_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

exports.sendEmailConfimation = async (profileId, email) => {
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
