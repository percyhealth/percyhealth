/* eslint-disable func-names */
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { getFieldNotFoundError } from 'errors';
import User from '../models/user_model';

// Configure what LocalStrategy will check for as a username
const localOptions = { usernameField: 'email' };

// Make a login strategy to check email and password against DB
const localLogin = new LocalStrategy(localOptions, (email, password, done) => User.findOne({ email }, (error, user) => {
  // Was a user with the given email able to be found?
  if (error) return done(error);
  if (!user) return done(null, false, { message: 'Email address not associated with a user' });

  // Compare password associated with email and passed password
  return user.comparePassword(password, (err, isMatch) => {
    if (err) {
      done(err);
    } else if (!isMatch) {
      done(null, false, { message: 'Incorrect password' });
    } else {
      done(null, user);
    }
  });
}));

passport.use(localLogin);

// Create function to transmit result of authenticate() call to user or next middleware
const requireSignin = function (req, res, next) {
  // Validation of parameters
  if (!req.body.email) {
    return res.status(400).json({ message: getFieldNotFoundError('email') });
  }

  if (!req.body.password) {
    return res.status(400).json({ message: getFieldNotFoundError('password') });
  }

  // eslint-disable-next-line prefer-arrow-callback
  return passport.authenticate('local', { session: false }, function (err, user, info) {
    // Return any existing errors
    if (err) { return next(err); }

    // If no user found, return appropriate error message
    if (!user) { return res.status(401).json({ message: info.message || 'Error authenticating email and password' }); }

    req.user = user;

    return next();
  })(req, res, next);
};

export default requireSignin;
