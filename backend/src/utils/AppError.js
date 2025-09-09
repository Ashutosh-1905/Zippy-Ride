// Custom error class for handling operational errors.
// This allows the global error handler to differentiate between
// expected, operational errors (e.g., "Invalid input") and
// unexpected programming errors.

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
