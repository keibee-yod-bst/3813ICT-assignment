// server/middleware/__tests__/auth.test.js
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { authenticateJWT, authorizeRoles } = require('../auth');

jest.mock('jsonwebtoken');
jest.mock('../../models/User');

describe('Middleware: authenticateJWT', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  test('should return 401 if no token is provided', async () => {
    await authenticateJWT(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 403 if token verification fails', async () => {
    req.headers.authorization = 'invalid_token';
    jwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('Invalid token');
    });
    await authenticateJWT(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 500 if error occurs during User.findById', async () => {
    req.headers.authorization = 'valid_token';
    jwt.verify.mockReturnValue({ userId: '123' });
    User.findById.mockRejectedValue(new Error('DB error'));
    await authenticateJWT(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });

  test('should set req.user and call next() if token is valid and user is found', async () => {
    req.headers.authorization = 'valid_token';
    const user = { _id: '123', roles: ['User'] };
    jwt.verify.mockReturnValue({ userId: '123' });
    User.findById.mockResolvedValue(user);
    await authenticateJWT(req, res, next);
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });
});

describe('Middleware: authorizeRoles', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: null,
    };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  test('should return 401 if req.user is not set', () => {
    const middleware = authorizeRoles('Admin');
    middleware(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 403 if user does not have required role', () => {
    req.user = { roles: ['User'] };
    const middleware = authorizeRoles('Admin');
    middleware(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next() if user has one of the allowed roles', () => {
    req.user = { roles: ['Admin'] };
    const middleware = authorizeRoles('Admin', 'SuperAdmin');
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });
});
