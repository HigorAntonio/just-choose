const Joi = require('joi');

const resendConfirmEmailLocalProfileValidationSchema = Joi.object({
  profileId: Joi.number().required().messages({
    'number.base': 'authentication required',
    'any.required': 'authentication required',
  }),
});

module.exports = resendConfirmEmailLocalProfileValidationSchema;
