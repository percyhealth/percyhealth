import { getSuccessfulDeletionMessage } from 'helpers/constants';
import { userService } from 'services';
import { BaseError } from 'errors';

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getManyUsers({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const createNewUser = async (req, res, next) => {
  try {
    const {
      email, password, first_name: firstName, last_name: lastName,
    } = req.body;

    const emailAvailable = await userService.isEmailAvailable(email);
    if (!emailAvailable) throw new BaseError('Email address already associated to a user', 409);

    const newUser = await userService.createUser({
      email,
      password,
      first_name: firstName ?? '',
      last_name: lastName ?? '',
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
  } catch (error) {
    next(error);
  }
};

const userController = {
  getAllUsers,
  createNewUser,
  getUser,
  updateUser,
  deleteUser,
};

export default userController;
