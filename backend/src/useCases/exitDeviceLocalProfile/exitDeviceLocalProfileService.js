const localProfileRepository = require('../../repositories/localProfileRepository');
const exitDeviceLocalProfileValidationSchema = require('./exitDeviceLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const exitDeviceLocalProfileService = async ({
  profileId,
  refreshToken,
  password,
}) => {
  const data = await exitDeviceLocalProfileValidationSchema.validateAsync({
    profileId,
    refreshToken,
    password,
  });

  const decoded = localAuthUtils.verifyRefreshToken(data.refreshToken);
  if (decoded.sub !== data.profileId) {
    throw new Error('invalid "profile_id"');
  }

  const localProfile = await localProfileRepository.getLocalProfileById(
    data.profileId
  );
  if (!localProfile) {
    throw new Error('profile not found');
  }
  if (!localAuthUtils.comparePassword(data.password, localProfile.password)) {
    throw new Error('incorrect password');
  }

  if (
    !(await localAuthUtils.removeRefreshTokenFromStorage(
      decoded.sub,
      data.refreshToken
    ))
  ) {
    throw new Error('"refresh_token" not found');
  }
  // TODO: Enviar um email ao usuário, informando que a "sessão" em
  // um dos seus dispositivos foi encerrada

  return;
};

module.exports = exitDeviceLocalProfileService;
