/**
 * errors.js – custom error classes.
 */
export class AppError extends Error {
  constructor(message, statusCode, errorCode = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, "VALIDATION_FAILED");
  }
}

export class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404, "RESOURCE_NOT_FOUND");
  }
}
