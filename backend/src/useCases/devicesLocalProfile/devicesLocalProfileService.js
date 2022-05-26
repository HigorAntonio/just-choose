const devicesLocalProfileValidationSchema = require('./devicesLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const devicesLocalProfileService = async (profileId) => {
  const data = await devicesLocalProfileValidationSchema.validateAsync({
    profileId,
  });

  await localAuthUtils.clearExpiredRefreshTokensFromStorage(data.profileId);

  const devices = await localAuthUtils.getDevicesFromStorage(data.profileId);

  return devices;
};

module.exports = devicesLocalProfileService;
