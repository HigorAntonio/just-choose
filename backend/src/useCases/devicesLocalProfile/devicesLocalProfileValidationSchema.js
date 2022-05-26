const Joi = require('joi');

const devicesLocalProfileValidationSchema = Joi.object({
  profileId: Joi.number().required().messages({
    'number.base': 'authentication required',
    'any.required': 'authentication required',
  }),
});

module.exports = devicesLocalProfileValidationSchema;
