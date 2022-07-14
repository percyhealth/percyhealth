import joi from 'joi';

export const SignUpUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  first_name: joi.string().required(),
  last_name: joi.string().required(),
});
