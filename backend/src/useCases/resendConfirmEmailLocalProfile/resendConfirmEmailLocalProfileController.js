const resendConfirmEmailLocalProfileService = require('./resendConfirmEmailLocalProfileService');
const logger = require('../../lib/logger');

const resendConfirmEmailLocalProfileController = async (req, res) => {
  const profileId = req.profileId;

  try {
    await resendConfirmEmailLocalProfileService(profileId);

    return res.sendStatus(200);
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (['profile not found'].find((message) => message === error.message)) {
      return res.status(400).json({ message: error.message });
    }
    if (
      ['profile email already confirmed'].find(
        (message) => message === error.message
      )
    ) {
      return res.status(403).json({ message: error.message });
    }
    logger.error(error);
    return res.sendStatus(500);
  }
};

module.exports = resendConfirmEmailLocalProfileController;
