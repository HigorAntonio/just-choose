const Joi = require('joi');

const signUpLocalProfileValidationSchema = Joi.object({
  name: Joi.string()
    .min(4)
    .max(25)
    .pattern(/^[a-z0-9]+[a-z0-9_]*$/i)
    .message({
      'string.pattern.base':
        '"name" must only contain alpha-numeric characters',
    })
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(64).required(),
});

module.exports = signUpLocalProfileValidationSchema;
