const localProfileRepository = require('../../repositories/localProfileRepository');
const resendConfirmEmailLocalProfileValidationSchema = require('./resendConfirmEmailLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');
const Queue = require('../../lib/Queue');

const resendConfirmEmailLocalProfileService = async (profileId) => {
  const data =
    await resendConfirmEmailLocalProfileValidationSchema.validateAsync({
      profileId,
    });

  const localProfile = await localProfileRepository.getLocalProfileById(
    data.profileId
  );
  if (!localProfile) {
    throw new Error('profile not found');
  }
  if (localProfile.is_active) {
    throw new Error('profile email already confirmed');
  }

  await localAuthUtils.sendEmailConfirmation(
    localProfile.id,
    localProfile.email,
    Queue
  );

  return;
};

module.exports = resendConfirmEmailLocalProfileService;
