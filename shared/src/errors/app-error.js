/**
 * Custom error classes ensure all services return a uniform error response.
 * Extending native Error with `isOperational` flags helps the monitoring system
 * distinguish between known client errors (e.g., validation) and unexpected crashes.
 */
export class AppError extends Error {
  constructor(message, statusCode, errorCode = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Mark as expected error, not a bug
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
