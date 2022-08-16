import bodyParser from 'body-parser';
import express from 'express';
// import { createValidator } from 'express-joi-validation';

import { requireAuth } from 'authentication';
import { responseController } from 'controllers';
import { validationErrorHandler } from 'validation';
import { errorHandler } from 'errors';

const router = express();
// const validator = createValidator({ passError: true });

// TODO: Move middleware attachment to test file
if (process.env.NODE_ENV === 'test') {
  // enable json message body for posting data to router
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
  router.use(errorHandler);
}

// find and return all responses
router.route('/')
  .get(responseController.getAllResponses)
  .post(
    //  this requireAuth is probably a good idea to have. I took it out for now
    // because it was giving me issues on Postman
    // requireAuth,
    // currently no validator for responses
    // validator.body(CreateResponseSchema),
    responseController.createResponse,
  );

router.route('/:id')
  .get(responseController.getResponse)
  .put(
    requireAuth,
    // validator.body(UpdateResponseSchema),
    responseController.updateResponse,
  )
  .delete(requireAuth, responseController.deleteResponse);

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;
