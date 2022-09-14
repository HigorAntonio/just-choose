const uaParser = require('ua-parser-js');
const localProfileRepository = require('../../repositories/localProfileRepository');
const signInLocalProfileValidationSchema = require('./signInLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');

const signInLocalProfileService = async ({ email, password }, uastring) => {
  const data = await signInLocalProfileValidationSchema.validateAsync({
    email,
    password,
  });

  const localProfile = await localProfileRepository.getLocalProfileByEmail(
    data.email
  );
  if (!localProfile) {
    throw new Error('profile does not exist');
  }
  if (!localAuthUtils.comparePassword(data.password, localProfile.password)) {
    throw new Error('incorrect password');
  }

  const accessToken = localAuthUtils.generateAccessToken(
    localProfile.id,
    localProfile.name
  );
  const refreshToken = localAuthUtils.generateRefreshToken(
    localProfile.id,
    localProfile.name
  );
  const ua = uaParser(uastring);
  // TODO: Obter informações de localização do usuário através do ip (estado, país) e armazená-las no token
  const device = {
    os: ua.os.name,
    browser: ua.browser.name,
  };

  if (
    !(await localAuthUtils.storeRefreshToken(
      localProfile.id,
      refreshToken,
      device
    ))
  ) {
    throw new Error('error storing refresh token');
  }

  return { accessToken, refreshToken };
};

module.exports = signInLocalProfileService;
