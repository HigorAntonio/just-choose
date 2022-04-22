const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const CONFIRM_EMAIL_TOKEN_SECRET = process.env.CONFIRM_EMAIL_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const FORGOT_PASSWORD_TOKEN_SECRET = process.env.FORGOT_PASSWORD_TOKEN_SECRET;
const FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME =
  process.env.FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME;

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

exports.comparePassword = (password, hashed) => {
  return bcrypt.compareSync(password, hashed);
};

exports.verifyRefreshToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error('invalid "refresh_token"');
  }
};
