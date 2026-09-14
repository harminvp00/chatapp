
import { verifyToken } from '../config/jwt/token.js';
import { UnauthorizedAccess } from '../errors/auth.error.js';
// AuthMiddleware: verify the JWT token existance and validness, and grant access to user for specific or group of services
export default function AuthMiddleware(req, res, next) {
  try {

    // get a token
    const token  = req.cookies.token;
    
    // token existance 
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'wrong credentials for login'       
      });
      return;
    }

    // verification
    const decode = verifyToken(token);

    req.user = decode;
    next();
  } catch (error) {
    next(error);
  }
}
