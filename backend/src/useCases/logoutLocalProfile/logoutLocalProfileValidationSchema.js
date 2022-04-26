const Joi = require('joi');

const logoutLocalProfileValidationSchema = Joi.object({
  refreshToken: Joi.string().label('refresh_token').required(),
});

module.exports = logoutLocalProfileValidationSchema;
