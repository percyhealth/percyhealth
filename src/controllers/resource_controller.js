import { getSuccessfulDeletionMessage } from 'helpers/constants';
import { resourceService } from 'services';

const getAllResources = async (req, res, next) => {
  try {
    const resources = await resourceService.getManyResources({});
    res.status(200).json(resources);
  } catch (error) {
    next(error);
  }
};

const createResource = async (req, res, next) => {
  try {
    const savedResource = await resourceService.createResource(req.body);
    res.status(201).json(savedResource);
  } catch (error) {
    next(error);
  }
};

const getResource = async (req, res, next) => {
  try {
    const resource = await resourceService.getResource(req.params.id);
    res.status(200).send(resource);
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const resource = await resourceService.updateResource(req.params.id, req.body);
    res.status(200).json(resource);
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    await resourceService.deleteResource(req.params.id);
    res.status(200).json({ message: getSuccessfulDeletionMessage(req.params.id) });
  } catch (error) {
    next(error);
  }
};

const resourceController = {
  getAllResources,
  createResource,
  getResource,
  updateResource,
  deleteResource,
};

export default resourceController;
