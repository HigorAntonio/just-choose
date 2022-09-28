const Joi = require('joi');

const exitDeviceLocalProfileValidationSchema = Joi.object({
  profileId: Joi.number().required().messages({
    'number.base': 'authentication required',
    'any.required': 'authentication required',
  }),
  deviceId: Joi.string().label('device_id').required(),
  password: Joi.string().required(),
});

module.exports = exitDeviceLocalProfileValidationSchema;
