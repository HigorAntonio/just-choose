const localProfileRepository = require('../../repositories/localProfileRepository');
const confirmEmailLocalProfileValidationSchema = require('./confirmEmailLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const confirmEmailLocalProfileService = async ({ confirmEmailToken }) => {
  const data = await confirmEmailLocalProfileValidationSchema.validateAsync({
    confirmEmailToken,
  });

  const decoded = localAuthUtils.verifyConfirmEmailToken(
    data.confirmEmailToken
  );

  const localProfile = await localProfileRepository.getLocalProfileById(
    decoded.sub
  );
  if (!localProfile) {
    throw new Error('profile not found');
  }

  await localProfileRepository.updateIsActiveLocalProfile(decoded.sub, true);

  return;
};

module.exports = confirmEmailLocalProfileService;
