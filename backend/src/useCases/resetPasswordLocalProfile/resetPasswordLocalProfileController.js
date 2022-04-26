const resetPasswordLocalProfileService = require('./resetPasswordLocalProfileService');
const logger = require('../../lib/logger');

const resetPasswordLocalProfileController = async (req, res) => {
  const {
    email,
    forgot_password_token: forgotPasswordToken,
    new_password: newPassword,
  } = req.body;

  try {
    await resetPasswordLocalProfileService({
      email,
      forgotPasswordToken,
      newPassword,
    });

    return res.sendStatus(200);
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (error.message === 'profile not found') {
      return res.status(400).json({ message: error.message });
    }
    if (
      ['invalid "forgot_password_token"', 'invalid "email"'].find(
        (message) => message === error.message
      )
    ) {
      return res.status(403).json({ message: error.message });
    }
    logger.error(error);
    return res.sendStatus(500);
  }
};

module.exports = resetPasswordLocalProfileController;
