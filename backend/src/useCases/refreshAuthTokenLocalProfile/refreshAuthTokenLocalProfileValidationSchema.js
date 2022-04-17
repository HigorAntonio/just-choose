const Joi = require('joi');

const refreshAuthTokenLocalProfieValidationSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = refreshAuthTokenLocalProfieValidationSchema;
