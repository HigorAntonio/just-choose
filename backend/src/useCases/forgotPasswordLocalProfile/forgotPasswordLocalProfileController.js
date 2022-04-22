const forgotPasswordLocalProfileService = require('./forgotPasswordLocalProfileService');
const logger = require('../../lib/logger');

const forgotPasswordLocalProfileController = async (req, res) => {
  const { email } = req.body;

  try {
    await forgotPasswordLocalProfileService(email);

    return res.sendStatus(200);
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (error.message === 'profile not found') {
      return res.status(400).json({ message: error.message });
    }
    logger.error(error);
    return res.sendStatus(500);
  }
};

module.exports = forgotPasswordLocalProfileController;
