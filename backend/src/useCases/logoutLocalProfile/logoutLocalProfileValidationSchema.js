const Joi = require('joi');

const logoutLocalProfileValidationSchema = Joi.object({
  profileId: Joi.number().required().messages({
    'number.base': 'authentication required',
    'any.required': 'authentication required',
  }),
  refreshToken: Joi.string().label('refresh_token').required(),
});

module.exports = logoutLocalProfileValidationSchema;
