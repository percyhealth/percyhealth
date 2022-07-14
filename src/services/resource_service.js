import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import { Resources } from 'models';

const getManyResources = async (fields) => (
  Resources.find(fields)
);

const createResource = (fields) => (
  new Resources(fields).save()
);

const getResource = async (id) => {
  const resource = await Resources.findById(id);
  if (!resource) throw new DocumentNotFoundError(id);
  return resource;
};

const updateResource = async (id, fields) => {
  const updatedResource = await Resources.findByIdAndUpdate(id, fields, { new: true });
  if (!updatedResource) throw new DocumentNotFoundError(id);
  return updatedResource;
};

const deleteResource = async (id) => {
  const deletedResource = await Resources.findByIdAndDelete(id);
  if (!deletedResource) throw new DocumentNotFoundError(id);
  return deletedResource;
};

const resourceService = {
  getManyResources,
  createResource,
  getResource,
  updateResource,
  deleteResource,
};

export default resourceService;
