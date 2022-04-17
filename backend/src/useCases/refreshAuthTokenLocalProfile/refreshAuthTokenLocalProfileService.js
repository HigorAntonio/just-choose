const redisClient = require('../../lib/redisClient');
const refreshAuthTokenLocalProfileValidationSchema = require('./refreshAuthTokenLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const refreshAuthTokenLocalProfileService = async (refreshToken) => {
  const data = await refreshAuthTokenLocalProfileValidationSchema.validateAsync(
    {
      refreshToken,
    }
  );

  try {
    const decoded = localAuthUtils.verifyRefreshToken(data.refreshToken);
    if (
      (await redisClient.sismemberAsync(
        `refreshTokensProfile${decoded.id}`,
        refreshToken
      )) !== 1
    ) {
      throw new Error('invalid "refresh_token"');
    }

    delete decoded.iat;
    const accessToken = localAuthUtils.generateAccessToken(decoded);
    return accessToken;
  } catch (error) {
    throw new Error('invalid "refresh_token"');
  }
};

module.exports = refreshAuthTokenLocalProfileService;
