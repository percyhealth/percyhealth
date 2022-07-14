import jwt from 'jwt-simple';
import dotenv from 'dotenv';

import { BaseError } from 'errors';
import { userService } from 'services';

dotenv.config();

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  const exp = Math.round((timestamp + 2.628e+9) / 1000);
  return jwt.encode({ sub: user._id, iat: timestamp, exp }, process.env.AUTH_SECRET);
};

const signUpUser = async (req, res, next) => {
  try {
    const {
      email, password, first_name: firstName, last_name: lastName,
    } = req.body;

    // Check if a user already has this email address
    const emailAvailable = await userService.isEmailAvailable(email);
    if (!emailAvailable) throw new BaseError('Email address already associated to a user', 409);

    // Make a new user from passed data
    const savedUser = await userService.createUser({
      email,
      password,
      first_name: firstName ?? '',
      last_name: lastName ?? '',
    });

    // Save the user then transmit to frontend
    res.status(201).json({ token: tokenForUser(savedUser), user: savedUser });
  } catch (error) {
    next(error);
  }
};

const signInUser = (req, res) => (
  res.json({ token: tokenForUser(req.user), user: req.user })
);

const jwtSignIn = (req, res) => (
  res.json({ user: req.user })
);

const authController = {
  signUpUser,
  signInUser,
  jwtSignIn,
};

export default authController;
