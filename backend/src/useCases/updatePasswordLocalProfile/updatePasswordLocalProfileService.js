const localProfileRepository = require('../../repositories/localProfileRepository');
const updatePasswordLocalProfileValidationSchema = require('./updatePasswordLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const updatePasswordLocalProfileService = async ({
  profileId,
  currentPassword,
  newPassword,
}) => {
  const data = await updatePasswordLocalProfileValidationSchema.validateAsync({
    profileId,
    currentPassword,
    newPassword,
  });

  const localProfile = await localProfileRepository.getLocalProfileById(
    data.profileId
  );
  if (!localProfile) {
    throw new Error('profile not found');
  }
  if (
    !localAuthUtils.comparePassword(data.currentPassword, localProfile.password)
  ) {
    throw new Error('incorrect password');
  }

  await localProfileRepository.updatePasswordLocalProfile(
    data.profileId,
    data.newPassword
  );

  return;
};

module.exports = updatePasswordLocalProfileService;
