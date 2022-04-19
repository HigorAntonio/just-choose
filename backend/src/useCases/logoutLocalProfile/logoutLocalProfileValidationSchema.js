const Joi = require('joi');

const logoutLocalProfileValidationSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = logoutLocalProfileValidationSchema;
