import joi from 'joi';

export const CreateUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  first_name: joi.string().required(),
  last_name: joi.string().required(),
});

export const UpdateUserSchema = joi.object({
  email: joi.string().email(),
  password: joi.string(),
  first_name: joi.string(),
  last_name: joi.string(),
});
