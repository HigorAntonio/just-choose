const logoutLocalProfileService = require('./logoutLocalProfileService');
const logger = require('../../lib/logger');

const logoutLocalProfileController = async (req, res) => {
  const profileId = req.profileId;
  const { refresh_token: refreshToken } = req.body;

  try {
    await logoutLocalProfileService({ profileId, refreshToken });

    return res.sendStatus(204);
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ message: error.details[0].message });
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

module.exports = logoutLocalProfileController;
