const Joi = require('joi');

const exitDeviceLocalProfileValidationSchema = Joi.object({
  profileId: Joi.number().required().messages({
    'number.base': 'authentication required',
    'any.required': 'authentication required',
  }),
  refreshToken: Joi.string().label('refresh_token').required(),
  password: Joi.string().required(),
});

module.exports = exitDeviceLocalProfileValidationSchema;
