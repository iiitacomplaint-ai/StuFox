const { verifyToken } = require('../utils/utility');

// ✅ Authenticate Middleware
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token missing or malformed. Please log in again.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // ✅ Fix: Map the decoded token to match expected structure
    // The token has 'role' but middleware expects 'user_role'
    req.user = {
      user_id: decoded.user_id,
      role: decoded.role,  // Add role field for easier access
      user_role: decoded.role  // Keep user_role for backward compatibility
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

const authorise = (roles = []) => {
  return (req, res, next) => {
    // ✅ Check both possible field names
    const userRole = req.user.role || req.user.user_role;
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${userRole} role is not authorised to perform this action. Required roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { authenticate, authorise };