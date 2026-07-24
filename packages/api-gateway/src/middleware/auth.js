import jwt from "jsonwebtoken";
import { AppError } from "@restaurant/shared/errors/app-error.js";

/**
 * The API Gateway acts as the sole authentication guard.
 * It validates the JWT once and forwards user context (id, role) via headers.
 * This reduces CPU overhead in downstream services and centralizes revocation logic.
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError("Missing authorization header", 401);

    const token = authHeader.split(" ")[1];
    if (!token) throw new AppError("Invalid token format", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request for downstream middleware.
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      email: decoded.email,
    };

    // Forward as headers to internal services.
    req.headers["x-user-id"] = decoded.sub;
    req.headers["x-user-role"] = decoded.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid or expired token", 401));
    } else {
      next(error);
    }
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(new AppError("Insufficient permissions", 403));
  }
  next();
};
