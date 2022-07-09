const updatePasswordLocalProfileService = require('./updatePasswordLocalProfileService');
const logger = require('../../lib/logger');

const updatePasswordLocalProfileController = async (req, res) => {
  const profileId = req.profileId;
  const { current_password: currentPassword, new_password: newPassword } =
    req.body;

  try {
    await updatePasswordLocalProfileService({
      profileId,
      currentPassword,
      newPassword,
    });

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
    logger.error(error);
    return res.sendStatus(500);
  }
};

module.exports = updatePasswordLocalProfileController;
