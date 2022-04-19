const redisClient = require('../../lib/redisClient');
const logoutLocalProfileValidationSchema = require('./logoutLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const logoutLocalProfileService = async ({ profileId, refreshToken }) => {
  const data = await logoutLocalProfileValidationSchema.validateAsync({
    refreshToken,
  });

  const decoded = localAuthUtils.verifyRefreshToken(data.refreshToken);
  if (decoded.id !== profileId) {
    throw new Error('invalid profile');
  }

  if (
    (await redisClient.sremAsync(
      `refreshTokensProfile${decoded.id}`,
      refreshToken
    )) === 0
  ) {
    throw new Error('"refresh_token" not found');
  }

  return;
};

module.exports = logoutLocalProfileService;
