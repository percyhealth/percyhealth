export const validationErrorHandler = (err, req, res, next) => {
  if (err.error?.isJoi) {
    const errors = err.error.details.map((d) => d.message.replace(/"/g, "'"));
    res.status(400).send({ message: 'Request error', errors });
  } else {
    next(err);
  }
};
