import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';

import { requireAuth } from 'authentication';
import { resourceController } from 'controllers';
import { CreateResourceSchema, UpdateResourceSchema } from 'validation/resource';
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

// find and return all resources
router.route('/')
  .get(resourceController.getAllResources)
  .post(
    requireAuth,
    validator.body(CreateResourceSchema),
    resourceController.createResource,
  );

// // ! TESTING ONLY
// .delete(requireAuth, async (req, res) => {
//   try {
//     await Resources.deleteMany({ })
//     return res.status(200).json({ message: 'Successfully deleted all resources.' });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// });

router.route('/:id')
  .get(resourceController.getResource)
  .put(
    requireAuth,
    validator.body(UpdateResourceSchema),
    resourceController.updateResource,
  )
  .delete(requireAuth, resourceController.deleteResource);

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;
