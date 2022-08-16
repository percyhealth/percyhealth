import mongoose, { Schema } from 'mongoose';

const ResponseSchema = new Schema({
  date: Date,
  // theorhetically question number could be inferred by
  // n-1 index into an array of response values
  responses: {},
  scores: {},
}, {
  toJSON: {
    virtuals: true,
  },
});

const ResponseModel = mongoose.model('Response', ResponseSchema);

export default ResponseModel;
