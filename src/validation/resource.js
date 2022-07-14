import joi from 'joi';

export const CreateResourceSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  value: joi.number().required(),
});

export const UpdateResourceSchema = joi.object({
  title: joi.string(),
  description: joi.string(),
  value: joi.number(),
});
