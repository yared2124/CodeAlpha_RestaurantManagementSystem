/**
 * error-handler.js – global error handling middleware.
 */
import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.errorCode || "INTERNAL_ERROR",
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};
