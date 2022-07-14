import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import { Users } from 'models';

const getManyUsers = async (fields) => (
  Users.find(fields)
);

const isEmailAvailable = async (email) => (
  Users.findOne({ email }).lean().then((d) => !d)
);

const createUser = async (fields) => (
  new Users(fields).save()
);

const getUser = async (id) => {
  const user = await Users.findById(id);
  if (!user) throw new DocumentNotFoundError(id);
  return user;
};

const updateUser = async (id, fields) => {
  const user = await Users.findByIdAndUpdate(id, fields, { new: true });
  if (!user) throw new DocumentNotFoundError(id);
  return user;
};

const deleteUser = async (id) => {
  const user = await Users.findByIdAndDelete(id);
  if (!user) throw new DocumentNotFoundError(id);
  return user;
};

const userService = {
  getManyUsers,
  isEmailAvailable,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};

export default userService;
