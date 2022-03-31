const signInLocalProfileService = require('./signInLocalProfileService');
const logger = require('../../lib/logger');

const signInLocalProfileController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { accessToken, refreshToken } = await signInLocalProfileService(
      {
        email,
        password,
      },
      req.headers['user-agent']
    );

    return res.json({ access_token: accessToken, refresh_token: refreshToken });
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (
      error.message === 'profile does not exist' ||
      error.message === 'incorrect password'
    ) {
      return res.status(400).json({ message: error.message });
    }
    logger.error(error);
    return res.sendStatus(500);
  }
};

module.exports = signInLocalProfileController;
