const devicesLocalProfileService = require('./devicesLocalProfileService');
const logger = require('../../lib/logger');

const devicesLocalProfileController = async (req, res) => {
  const profileId = req.profileId;

  try {
    const devices = await devicesLocalProfileService(profileId);

    return res.json(devices);
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ message: error.details[0].message });
    }
    logger.error(error);
    return res.sendStatus(500);
  }
};

module.exports = devicesLocalProfileController;
