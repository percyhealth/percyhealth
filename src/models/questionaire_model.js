import mongoose, { Schema } from 'mongoose';

const QuestionaireSchema = new Schema({
  title: String,
  author: String,
  standard_frequency: String,
  description: String,
  scoring_schema: {},
  // wondering if there needs to be a sub-schema for questions
  // such that each question has its own ObjectId
  // maybe not necesary tho, questions can be saved by number with
  // survey id
  questions: {}
}, {
  toJSON: {
    virtuals: true,
  },
});

const QuestionaireModel = mongoose.model('Questionaire', QuestionaireSchema);

export default QuestionaireModel;
