import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import { Responses } from 'models';

const getManyResponses = async (fields) => (
  Responses.find(fields)
);

const createResponse = (fields) => (
  // not sure if this date operation is correct
  new Responses({ ...fields, date: Date.now() }).save()
);

const getResponse = async (id) => {
  const response = await Responses.findById(id);
  if (!response) throw new DocumentNotFoundError(id);
  return response;
};

const updateResponse = async (id, fields) => {
  const updatedResponse = await Responses.findByIdAndUpdate(id, fields, { new: true });
  if (!updatedResponse) throw new DocumentNotFoundError(id);
  return updatedResponse;
};

const deleteResponse = async (id) => {
  const deletedResponse = await Responses.findByIdAndDelete(id);
  if (!deletedResponse) throw new DocumentNotFoundError(id);
  return deletedResponse;
};

const responseService = {
  getManyResponses,
  createResponse,
  getResponse,
  updateResponse,
  deleteResponse,
};

export default responseService;
