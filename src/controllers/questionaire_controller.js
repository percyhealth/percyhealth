import { getSuccessfulDeletionMessage } from 'helpers/constants';
import { questionaireService } from 'services';

const getAllQuestionaires = async (req, res, next) => {
  try {
    const questionaires = await questionaireService.getManyQuestionaires({});
    res.status(200).json(questionaires);
  } catch (error) {
    next(error);
  }
};

const createQuestionaire = async (req, res, next) => {
  try {
    const savedQuestionaire = await questionaireService.createQuestionaire(req.body);
    res.status(201).json(savedQuestionaire);
  } catch (error) {
    next(error);
  }
};

const getQuestionaire = async (req, res, next) => {
  try {
    const questionaire = await questionaireService.getQuestionaire(req.params.id);
    res.status(200).send(questionaire);
  } catch (error) {
    next(error);
  }
};

const updateQuestionaire = async (req, res, next) => {
  try {
    const questionaire = await questionaireService.updateQuestionaire(req.params.id, req.body);
    res.status(200).json(questionaire);
  } catch (error) {
    next(error);
  }
};

const deleteQuestionaire = async (req, res, next) => {
  try {
    await questionaireService.deleteQuestionaire(req.params.id);
    res.status(200).json({ message: getSuccessfulDeletionMessage(req.params.id) });
  } catch (error) {
    next(error);
  }
};

const questionaireController = {
  getAllQuestionaires,
  createQuestionaire,
  getQuestionaire,
  updateQuestionaire,
  deleteQuestionaire,
};

export default questionaireController;
