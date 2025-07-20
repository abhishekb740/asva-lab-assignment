const { requireAnyRole } = require('../src/api/middleware/auth');

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('requireAnyRole', () => {
    test('Should allow access for user with required role', () => {
      req.user = { userId: 1, role: 'admin' };
      const middleware = requireAnyRole('admin', 'user');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('Should allow access for user with any of the required roles', () => {
      req.user = { userId: 1, role: 'user' };
      const middleware = requireAnyRole('admin', 'user');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('Should deny access for user without required role', () => {
      req.user = { userId: 1, role: 'user' };
      const middleware = requireAnyRole('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Access denied. Required roles: admin',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('Should deny access for unauthenticated user', () => {
      req.user = null;
      const middleware = requireAnyRole('user');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('Should handle multiple required roles correctly', () => {
      req.user = { userId: 1, role: 'moderator' };
      const middleware = requireAnyRole('admin', 'user');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Access denied. Required roles: admin, user',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
}); 
