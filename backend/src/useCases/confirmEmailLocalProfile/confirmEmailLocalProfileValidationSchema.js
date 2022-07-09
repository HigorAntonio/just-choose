const Joi = require('joi');

const confirmEmailLocalProfileValidationSchema = Joi.object({
  confirmEmailToken: Joi.string().label('confirm_email_token').required(),
});

module.exports = confirmEmailLocalProfileValidationSchema;
