import { verifyToken } from "../config/jwt.js";

/**
 * AuthMiddleware
 * Get Token In between the HTTP request
 * Check token is exists
 * if token exists: decode detail from the token, and send with request body to the controller
 * else return error
 */

export default function AuthMiddleware(req, res, next) {
  try {
    // get a token
    const token = req.cookies.access_token;

    // token existance
    if (!token) {
      res.status(401).json({
        success: false,
        message: "unauthorized access",
      });
      return;
    }

    // token verification
    const decode = verifyToken(token);

    req.user = decode;
    next();
  } catch (error) {
    next(error);
  }
}
