import { AppError } from "../utils/errors.js";

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(new AppError("Insufficient permissions", 403));
  }
  next();
};
