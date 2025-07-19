const { verifyToken, extractToken } = require('../../utils/jwt');

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = extractToken(authHeader);
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }
    
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
    
  } catch (error) {
    return res.status(403).json({ 
      error: error.message,
      code: 'INVALID_TOKEN'
    });
  }
}

function requireAnyRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireAnyRole
}; 
