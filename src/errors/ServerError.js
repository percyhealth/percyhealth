import BaseError from './BaseError';

class ServerError extends BaseError {
  constructor(message) {
    super(message, 500);
  }
}

export default ServerError;
