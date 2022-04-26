const signUpLocalProfileService = require('./signUpLocalProfileService');
const logger = require('../../lib/logger');

const signUpLocalProfileController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const { accessToken, refreshToken } = await signUpLocalProfileService(
      {
        name,
        email,
        password,
      },
      req.headers['user-agent']
    );

    return res
      .status(201)
      .json({ access_token: accessToken, refresh_token: refreshToken });
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (
      ['"name" unavailable', '"email" unavailable'].find(
        (message) => message === error.message
      )
    ) {
      return res.status(409).json({ message: error.message });
    }
    logger.error(error);
    return res.sendStatus(500);
  }
};

module.exports = signUpLocalProfileController;
