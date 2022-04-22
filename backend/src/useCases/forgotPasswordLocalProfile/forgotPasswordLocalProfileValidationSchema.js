const Joi = require('joi');

const forgotPasswordLocalProfileValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = forgotPasswordLocalProfileValidationSchema;
