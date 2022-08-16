import joi from 'joi';

export const CreateQuestionaireSchema = joi.object({
  title: joi.string().required(),
  author: joi.string().required(),
  standard_frequency: joi.string().required(),
  description: joi.string().required(),
  // changed to JSON
  scoring_schema: joi.any().required(),
  questions: joi.any().required()
});

export const UpdateQuestionaireSchema = joi.object({
  title: joi.string(),
  author: joi.string(),
  standard_frequency: joi.string(),
  description: joi.string(),
  // changed to JSON
  scoring_schema: joi.any(),
  questions: joi.any()
});
