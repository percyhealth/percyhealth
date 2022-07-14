class BaseError extends Error {
  constructor(message, code) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.code = code;

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export default BaseError;
