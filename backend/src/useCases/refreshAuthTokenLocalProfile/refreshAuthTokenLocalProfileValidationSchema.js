const Joi = require('joi');

const refreshAuthTokenLocalProfieValidationSchema = Joi.object({
  refreshToken: Joi.string().label('refresh_token').required(),
});

module.exports = refreshAuthTokenLocalProfieValidationSchema;
