const confirmEmailLocalProfileService = require('./confirmEmailLocalProfileService');
const logger = require('../../lib/logger');

const confirmEmailLocalProfileController = async (req, res) => {
  const confirmEmailToken = req.params.token;

  try {
    await confirmEmailLocalProfileService({ confirmEmailToken });

    return res.sendStatus(200);
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (['profile not found'].find((message) => message === error.message)) {
      return res.status(400).json({ message: error.message });
    }
    if (
      ['invalid "confirm_email_token"'].find(
        (message) => message === error.message
      )
    ) {
      return res.status(403).json({ message: error.message });
    }
    logger.error(error);
    return res.sendStatus(500);
  }
};

module.exports = confirmEmailLocalProfileController;
