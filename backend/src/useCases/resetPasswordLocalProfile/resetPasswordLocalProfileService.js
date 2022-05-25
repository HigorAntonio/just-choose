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

  const decoded = localAuthUtils.verifyForgotPasswordToken(
    data.forgotPasswordToken
  );
  if (decoded.sub !== profile.id) {
    throw new Error('invalid "email"');
  }

  if (
    !(await localAuthUtils.isForgotPasswordTokenInStorage(
      profile.id,
      data.forgotPasswordToken
    ))
  ) {
    throw new Error('invalid "forgot_password_token"');
  }

  if (
    !(await localAuthUtils.removeForgotPasswordTokenFromStorage(
      profile.id,
      data.forgotPasswordToken
    ))
  ) {
    throw new Error('error removing forgot password token from storage');
  }

  await localProfileRepository.updatePasswordLocalProfile(
    profile.id,
    data.newPassword
  );

  return;
};

module.exports = resetPasswordLocalProfileService;
