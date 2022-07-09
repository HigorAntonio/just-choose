const exitDeviceLocalProfileService = require('./exitDeviceLocalProfileService');
const logger = require('../../lib/logger');

const exitDeviceLocalProfileController = async (req, res) => {
  const profileId = req.profileId;
  const { refresh_token: refreshToken, password } = req.body;

  try {
    await exitDeviceLocalProfileService({ profileId, refreshToken, password });

    return res.sendStatus(200);
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (
      ['profile not found', 'incorrect password'].find(
        (message) => message === error.message
      )
    ) {
      return res.status(400).json({ message: error.message });
    }
    if (
      [
        'invalid "refresh_token"',
        'invalid "profile_id"',
        '"refresh_token" not found',
      ].find((message) => message === error.message)
    ) {
      return res.status(403).json({ message: error.message });
    }
    logger.error(error);
    return res.sendStatus(500);
  }
};

module.exports = exitDeviceLocalProfileController;