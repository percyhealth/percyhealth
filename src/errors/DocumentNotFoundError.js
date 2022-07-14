import BaseError from 'errors/BaseError';

class DocumentNotFoundError extends BaseError {
  constructor(id, info = '') {
    super(`Document with id '${id}' not found${info ? ` (${info})` : ''}`, 404);

    this.id = id;
    this.info = info;
  }
}

export default DocumentNotFoundError;
