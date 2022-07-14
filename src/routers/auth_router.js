import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';

import { requireAuth, requireSignin } from 'authentication';
import { authController } from 'controllers';
import { SignUpUserSchema } from 'validation/auth';
import { validationErrorHandler } from 'validation';
import { errorHandler } from 'errors';

const router = express();
const validator = createValidator({ passError: true });

// TODO: Move middleware attachment to test file
if (process.env.NODE_ENV === 'test') {
  // enable json message body for posting data to router
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
}

router.route('/signup')
  .post(
    validator.body(SignUpUserSchema),
    authController.signUpUser,
  );

// Send user object and server will send back authToken and user object
router.route('/signin')
  .post(requireSignin, authController.signInUser);

router.route('/jwt-signin')
  .get(requireAuth, authController.jwtSignIn);

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;
