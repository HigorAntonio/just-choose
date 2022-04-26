const redisClient = require('../../lib/redisClient');
const localProfileRepository = require('../../repositories/localProfileRepository');
const resetPasswordLocalProfileValidationSchema = require('./resetPasswordLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const resetPasswordLocalProfileService = async ({
  email,
  forgotPasswordToken,
  newPassword,
}) => {
  const data = await resetPasswordLocalProfileValidationSchema.validateAsync({
    email,
    forgotPasswordToken,
    newPassword,
  });

  const profile = await localProfileRepository.getLocalProfileByEmail(
    data.email
  );
  if (!profile) {
    throw new Error('profile not found');
  }

  if (
    (await redisClient.sismemberAsync(
      'forgotPasswordTokens',
      data.forgotPasswordToken
    )) !== 1
  ) {
    throw new Error('invalid "forgot_password_token"');
  }

  const decoded = localAuthUtils.verifyForgotPasswordToken(
    data.forgotPasswordToken
  );
  if (decoded.id !== profile.id) {
    throw new Error('invalid "email"');
  }

  await redisClient.sremAsync('forgotPasswordTokens', data.forgotPasswordToken);

  await localProfileRepository.updatePasswordLocalProfile(
    profile.id,
    data.newPassword
  );

  return;
};

module.exports = resetPasswordLocalProfileService;
