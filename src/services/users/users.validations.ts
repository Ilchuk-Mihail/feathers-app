import Joi from 'joi';

export const signUpSchema = Joi.object({
  password: Joi
    .string()
    .required()
    .pattern(/^[a-zA-Z0-9]{3,30}$/),

  email: Joi
    .string()
    .required()
    .email()
});
