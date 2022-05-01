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
    !(await localAuthUtils.isRefreshTokenInStorage(
      decoded.id,
      data.refreshToken
    ))
  ) {
    throw new Error('"refresh_token" not found');
  }

  delete decoded.iat;
  const accessToken = localAuthUtils.generateAccessToken(decoded);
  return accessToken;
};

module.exports = refreshAuthTokenLocalProfileService;
