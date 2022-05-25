const refreshAuthTokenLocalProfileService = require('./refreshAuthTokenLocalProfileService');
const logger = require('../../lib/logger');

const refreshAuthTokenLocalProfileController = async (req, res) => {
  const { refresh_token: refreshToken } = req.body;

  try {
    const { accessToken, refreshToken: newRefreshToken } =
      await refreshAuthTokenLocalProfileService(
        refreshToken,
        req.headers['user-agent']
      );

    return res.json({
      access_token: accessToken,
      refresh_token: newRefreshToken,
    });
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (error.message === 'invalid "refresh_token"') {
      return res.status(401).json({ message: error.message });
    }
    if (error.message === '"refresh_token" not found') {
      return res.status(403).json({ message: error.message });
    }
    logger.error(error);
    return res.sendStatus(500);
  }
};

module.exports = refreshAuthTokenLocalProfileController;
