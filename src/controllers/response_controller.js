import { getSuccessfulDeletionMessage } from 'helpers/constants';
import { responseService } from 'services';

const getAllResponses = async (req, res, next) => {
  try {
    const responses = await responseService.getManyResponses({});
    res.status(200).json(responses);
  } catch (error) {
    next(error);
  }
};

const createResponse = async (req, res, next) => {
  try {
    const savedResponse = await responseService.createResponse(req.body);
    res.status(201).json(savedResponse);
  } catch (error) {
    next(error);
  }
};

const getResponse = async (req, res, next) => {
  try {
    const response = await responseService.getResponse(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const updateResponse = async (req, res, next) => {
  try {
    const response = await responseService.updateResponse(req.params.id, req.body);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteResponse = async (req, res, next) => {
  try {
    await responseService.deleteResponse(req.params.id);
    res.status(200).json({ message: getSuccessfulDeletionMessage(req.params.id) });
  } catch (error) {
    next(error);
  }
};

const responseController = {
  getAllResponses,
  createResponse,
  getResponse,
  updateResponse,
  deleteResponse,
};

export default responseController;
