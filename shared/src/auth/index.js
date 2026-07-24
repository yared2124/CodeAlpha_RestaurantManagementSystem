import jwt from "jsonwebtoken";

/**
 * Verifies the JWT and extracts user info.
 * Services can use this if they need to validate token themselves,
 * but the API Gateway already forwards the user in headers for performance.
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
