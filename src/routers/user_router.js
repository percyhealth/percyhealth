import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';

import { requireAuth } from 'authentication';
import { userController } from 'controllers';
import { CreateUserSchema, UpdateUserSchema } from 'validation/users';
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

router.use(requireAuth);

// find and return all users
router.route('/')
  .get(userController.getAllUsers)

  // Create new user
  .post(
    validator.body(CreateUserSchema),
    userController.createNewUser,
  );

// // ! TESTING ONLY
// .delete(requireAuth, async (req, res) => {
//   try {
//     await Users.deleteMany({ });
//     return res.status(200).json({ message: 'Successfully deleted all users.' });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// });

router.route('/:id')
  .get(userController.getUser)
  .put(
    validator.body(UpdateUserSchema),
    userController.updateUser,
  )
  .delete(userController.deleteUser);

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;
