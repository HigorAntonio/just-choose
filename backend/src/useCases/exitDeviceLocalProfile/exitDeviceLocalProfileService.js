const localProfileRepository = require('../../repositories/localProfileRepository');
const exitDeviceLocalProfileValidationSchema = require('./exitDeviceLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const exitDeviceLocalProfileService = async ({
  profileId,
  deviceId,
  password,
}) => {
  const data = await exitDeviceLocalProfileValidationSchema.validateAsync({
    profileId,
    deviceId,
    password,
  });

  const localProfile = await localProfileRepository.getLocalProfileById(
    data.profileId
  );
  if (!localProfile) {
    throw new Error('profile not found');
  }
  if (!localAuthUtils.comparePassword(data.password, localProfile.password)) {
    throw new Error('incorrect password');
  }

  const device = await localAuthUtils.getDeviceFromStorage(
    data.profileId,
    data.deviceId
  );
  if (!device) {
    throw new Error('invalid "device_id"');
  }

  if (
    !(await localAuthUtils.removeRefreshTokenFromStorage(
      data.profileId,
      device.refreshToken
    ))
  ) {
    throw new Error('"refresh_token" not found');
  }
  // TODO: Enviar um email ao usuário, informando que a "sessão" em
  // um dos seus dispositivos foi encerrada

  return;
};

module.exports = exitDeviceLocalProfileService;
