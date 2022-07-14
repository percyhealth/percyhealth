import BaseError from './BaseError';
import DocumentNotFoundError from './DocumentNotFoundError';
import ServerError from './ServerError';

const createError = (err) => {
  switch (true) {
    case err instanceof BaseError:
      return err;
    case err.kind === 'ObjectId':
      return new DocumentNotFoundError(err.value);
    default:
      return new ServerError(err.message ?? '');
  }
};

const errorHandler = (err, req, res, _next) => {
  const error = createError(err);
  const message = error.code < 500
    ? 'Request error'
    : 'Server error';

  res.status(error.code).json({ message, errors: [error.message] });
};

export default errorHandler;
