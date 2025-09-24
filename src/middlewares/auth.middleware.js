import { MESSAGES, HTTP_STATUS, ERROR_CODES } from '../constants/index.js';
import { ROLES, ROLE_HIERARCHY } from '../constants/roles.constant.js';
import { verifyToken } from '../utils/jwt.util.js';
import { ensureUserIsActive } from '../utils/validators/auth-validators.util.js';
import { AppError } from '../utils/app-error.js';
import { findUserById } from '../models/user.model.js';
import { findAdminById } from '../models/admins/admin.model.js';

/**
 * Auth middleware: verifies JWT and sets req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new AppError(
      MESSAGES.AUTH.NO_TOKEN,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.AUTH.NO_TOKEN
    );
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded.id || !decoded.role) throw new AppError(
      MESSAGES.AUTH.INVALID_TOKEN_PAYLOAD,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.AUTH.INVALID_TOKEN_PAYLOAD
    );
    // Fetch user/admin based on role
    const user = decoded.role === ROLES.USER
      ? await findUserById(decoded.id)
      : await findAdminById(decoded.id);
    // Makes sure user is not banned or deleted
    ensureUserIsActive(user);
    // Attach user info to request
    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") throw new AppError(
      MESSAGES.AUTH.TOKEN_EXPIRED,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.AUTH.TOKEN_EXPIRED
    );
    if (err.name === "JsonWebTokenError") throw new AppError(
      MESSAGES.AUTH.INVALID_TOKEN,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.AUTH.INVALID_TOKEN
    );
    
    next(err);
  };
};

/**
 * Role-based access control middleware
 * Super admin bypasses role check
 * Throws if role does not have access
 */
export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    const { id, name, email, role } = req.user;
    if (role === ROLES.SUPER_ADMIN) return next();

    const allowedRoles = ROLE_HIERARCHY[role] || [];
    if (!allowedRoles.includes(requiredRole)) {
      console.log('Malicious route access attempt by:', { name, id, email, role });
      throw new AppError(
        MESSAGES.AUTH.ROUTE_ACCESS_DENIED,
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.AUTH.ROUTE_ACCESS_DENIED
      );
    }

    next();
  };
};