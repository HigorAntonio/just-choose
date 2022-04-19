const redisClient = require('../../lib/redisClient');
const refreshAuthTokenLocalProfileValidationSchema = require('./refreshAuthTokenLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const refreshAuthTokenLocalProfileService = async (refreshToken) => {
  const data = await refreshAuthTokenLocalProfileValidationSchema.validateAsync(
    {
      refreshToken,
    }
  );

  const decoded = localAuthUtils.verifyRefreshToken(data.refreshToken);
  if (
    (await redisClient.sismemberAsync(
      `refreshTokensProfile${decoded.id}`,
      refreshToken
    )) !== 1
  ) {
    throw new Error('"refresh_token" not found');
  }

  delete decoded.iat;
  const accessToken = localAuthUtils.generateAccessToken(decoded);
  return accessToken;
};

module.exports = refreshAuthTokenLocalProfileService;
