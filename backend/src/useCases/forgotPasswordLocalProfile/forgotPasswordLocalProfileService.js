const Queue = require('../../lib/Queue');
const localProfileRepository = require('../../repositories/localProfileRepository');
const forgotPasswordLocalProfileValidationSchema = require('./forgotPasswordLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const forgotPasswordLocalProfileService = async (email) => {
  const data = await forgotPasswordLocalProfileValidationSchema.validateAsync({
    email,
  });

  const profile = await localProfileRepository.getLocalProfileByEmail(
    data.email
  );
  if (!profile) {
    throw new Error('profile not found');
  }

  const forgotPasswordToken = localAuthUtils.generateForgotPasswordToken(
    profile.id
  );
  if (
    !(await localAuthUtils.storeForgotPasswordToken(
      profile.id,
      forgotPasswordToken
    ))
  ) {
    throw new Error('error storing forgot password token');
  }

  await Queue.add('ForgotPasswordMail', {
    email: data.email,
    token: forgotPasswordToken,
  });

  return;
};

module.exports = forgotPasswordLocalProfileService;
