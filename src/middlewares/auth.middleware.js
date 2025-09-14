import { ROLES, ROLE_HIERARCHY } from '../constants/roles.constant.js';
import { verifyToken } from '../utils/jwt.util.js';
import { ensureUserIsActive } from '../utils/validators/auth-validators.util.js';
import { findUserById } from '../models/user.model.js';
import { findAdminById } from '../models/admins/admin.model.js';

/**
 * Auth middleware: verifies JWT and sets req.user
 */
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Token not provided. Authentication required.',
      code: 'AUTH_ERROR',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    if (!decoded.id || !decoded.role) throw new Error('Invalid token payload');

    // Fetch user/admin based on role
    const user = decoded.role === ROLES.USER
      ? await findUserById(decoded.id)
      : await findAdminById(decoded.id);

    ensureUserIsActive(user);

    // Attach user info to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid or expired token.',
      code: 'AUTH_ERROR',
    });
  }
};

/**
 * Role-based access control middleware
 */
export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    const { role, name, id, email } = req.user;
    // Super admin always bypasses
    if (role === ROLES.SUPER_ADMIN) return next();
    // Check if role has access
    const allowedRoles = ROLE_HIERARCHY[role] || [];
    if (!allowedRoles.includes(requiredRole)) {
      console.log('Melicious route access attempt by:', { name, id, email, role });
      return res.status(403).json({
        success: false,
        data: null,
        message: 'Access denied. Route access forbidden.',
        code: 'FORBIDDEN_ROUTE',
      });
    }

    next();
  };
};