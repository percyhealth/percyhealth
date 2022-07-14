import mongoose, { Schema } from 'mongoose';

const ResourceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  value: { type: Number },
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, { __v, ...resource }) => resource
  }
});

const ResourceModel = mongoose.model('Resource', ResourceSchema);

export default ResourceModel;
