const uaParser = require('ua-parser-js');
const refreshAuthTokenLocalProfileValidationSchema = require('./refreshAuthTokenLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const refreshAuthTokenLocalProfileService = async (refreshToken, uastring) => {
  const data = await refreshAuthTokenLocalProfileValidationSchema.validateAsync(
    {
      refreshToken,
    }
  );

  const decoded = localAuthUtils.verifyRefreshToken(data.refreshToken);
  if (
    !(await localAuthUtils.isRefreshTokenInStorage(
      decoded.sub,
      data.refreshToken
    ))
  ) {
    throw new Error('"refresh_token" not found');
  }

  const accessToken = localAuthUtils.generateAccessToken(decoded.sub);
  const newRefreshToken = localAuthUtils.generateRefreshToken(decoded.sub);
  const ua = uaParser(uastring);
  // TODO: Obter informações de localização do usuário através do ip (estado, país) e armazená-las no token
  const device = {
    os: ua.os.name,
    browser: ua.browser.name,
  };

  if (
    !(await localAuthUtils.updateRefreshTokenInStorage(
      decoded.sub,
      refreshToken,
      newRefreshToken,
      device
    ))
  ) {
    throw new Error('error updating refresh token in storage');
  }

  return { accessToken, refreshToken: newRefreshToken };
};

module.exports = refreshAuthTokenLocalProfileService;
