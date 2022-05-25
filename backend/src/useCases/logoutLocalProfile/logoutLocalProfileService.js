const logoutLocalProfileValidationSchema = require('./logoutLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const logoutLocalProfileService = async ({ profileId, refreshToken }) => {
  const data = await logoutLocalProfileValidationSchema.validateAsync({
    profileId,
    refreshToken,
  });

  const decoded = localAuthUtils.verifyRefreshToken(data.refreshToken);
  if (decoded.sub !== data.profileId) {
    throw new Error('invalid "profile_id"');
  }

  if (
    !(await localAuthUtils.removeRefreshTokenFromStorage(
      decoded.sub,
      refreshToken
    ))
  ) {
    throw new Error('"refresh_token" not found');
  }

  return;
};

module.exports = logoutLocalProfileService;
