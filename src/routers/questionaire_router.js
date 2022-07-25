import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';

import { requireAuth } from 'authentication';
import { questionaireController } from 'controllers';
import { CreateQuestionaireSchema, UpdateQuestionaireSchema } from 'validation/questionaire';
import { validationErrorHandler } from 'validation';
import { errorHandler } from 'errors';

const router = express();
const validator = createValidator({ passError: true });

// TODO: Move middleware attachment to test file
if (process.env.NODE_ENV === 'test') {
  // enable json message body for posting data to router
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
  router.use(errorHandler);
}

// find and return all questionaires
router.route('/')
  .get(questionaireController.getAllQuestionaires)
  .post(
    requireAuth,
    validator.body(CreateQuestionaireSchema),
    questionaireController.createQuestionaire,
  );

// // ! TESTING ONLY
// .delete(requireAuth, async (req, res) => {
//   try {
//     await Questionaires.deleteMany({ })
//     return res.status(200).json({ message: 'Successfully deleted all questionaires.' });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// });

router.route('/:id')
  .get(questionaireController.getQuestionaire)
  .put(
    requireAuth,
    validator.body(UpdateQuestionaireSchema),
    questionaireController.updateQuestionaire,
  )
  .delete(requireAuth, questionaireController.deleteQuestionaire);

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;
