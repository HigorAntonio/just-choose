const uaParser = require('ua-parser-js');
const localProfileRepository = require('../../repositories/localProfileRepository');
const signUpLocalProfileValidationSchema = require('./signUpLocalProfileValidationSchema');
const localAuthUtils = require('../../utils/localAuth');
const Queue = require('../../lib/Queue');

const signUpLocalProfileService = async (
  { name, email, password },
  uastring
) => {
  const localProfile = await signUpLocalProfileValidationSchema.validateAsync({
    name,
    email,
    password,
  });

  if (await localProfileRepository.getLocalProfileByName(localProfile.name)) {
    throw new Error('"name" unavailable');
  }
  if (await localProfileRepository.getLocalProfileByEmail(localProfile.email)) {
    throw new Error('"email" unavailable');
  }

  const profileId = await localProfileRepository.saveLocalProfile({
    name: localProfile.name,
    email: localProfile.email,
    password: localProfile.password,
  });

  await localAuthUtils.sendEmailConfirmation(
    profileId,
    localProfile.email,
    Queue
  );

  const ua = uaParser(uastring);
  // TODO: Obter informações de localização do usuário através do ip (estado, país) e armazená-las no token
  const accessToken = localAuthUtils.generateAccessToken({ id: profileId });
  const refreshToken = localAuthUtils.generateRefreshToken({
    id: profileId,
    os: ua.os.name,
    browser: ua.browser.name,
  });

  await localAuthUtils.storeRefreshToken(profileId, refreshToken);

  return { accessToken, refreshToken };
};

module.exports = signUpLocalProfileService;
