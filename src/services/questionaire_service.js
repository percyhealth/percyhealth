import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import { Questionaires } from 'models';

const getManyQuestionaires = async (fields) => (
  Questionaires.find(fields)
);

const createQuestionaire = (fields) => (
  new Questionaires(fields).save()
);

const getQuestionaire = async (id) => {
  const questionaire = await Questionaires.findById(id);
  if (!questionaire) throw new DocumentNotFoundError(id);
  return questionaire;
};

const updateQuestionaire = async (id, fields) => {
  const updatedQuestionaire = await Questionaires.findByIdAndUpdate(id, fields, { new: true });
  if (!updatedQuestionaire) throw new DocumentNotFoundError(id);
  return updatedQuestionaire;
};

const deleteQuestionaire = async (id) => {
  const deletedQuestionaire = await Questionaires.findByIdAndDelete(id);
  if (!deletedQuestionaire) throw new DocumentNotFoundError(id);
  return deletedQuestionaire;
};

const questionaireService = {
  getManyQuestionaires,
  createQuestionaire,
  getQuestionaire,
  updateQuestionaire,
  deleteQuestionaire,
};

export default questionaireService;
