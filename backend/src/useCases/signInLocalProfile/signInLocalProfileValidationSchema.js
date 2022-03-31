const Joi = require('joi');

const signInLocalProfileValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = signInLocalProfileValidationSchema;
