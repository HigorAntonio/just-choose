const Joi = require('joi');

const updatePasswordLocalProfileValidationSchema = Joi.object({
  profileId: Joi.number().required().messages({
    'number.base': 'authentication required',
    'any.required': 'authentication required',
  }),
  currentPassword: Joi.string()
    .label('current_password')
    .min(8)
    .max(64)
    .required(),
  newPassword: Joi.string().label('new_password').min(8).max(64).required(),
});

module.exports = updatePasswordLocalProfileValidationSchema;
