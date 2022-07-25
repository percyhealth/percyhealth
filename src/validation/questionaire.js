import joi from 'joi';

export const CreateQuestionaireSchema = joi.object({
  title: joi.string().required(),
  author: joi.string().required(),
  standard_frequency: joi.string().required(),
  description: joi.string().required(),
  scoring_schema: joi.array().required(),
  questions: joi.array().required()
});

export const UpdateQuestionaireSchema = joi.object({
  title: joi.string(),
  author: joi.string(),
  standard_frequency: joi.string(),
  description: joi.string(),
  scoring_schema: joi.array(),
  questions: joi.array()
});
