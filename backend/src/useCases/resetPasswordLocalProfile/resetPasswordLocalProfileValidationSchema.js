const Joi = require('joi');

const resetPasswordLocalProfileValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  forgotPasswordToken: Joi.string().label('forgot_password_token').required(),
  newPassword: Joi.string().label('new_password').min(8).max(64).required(),
});

module.exports = resetPasswordLocalProfileValidationSchema;
