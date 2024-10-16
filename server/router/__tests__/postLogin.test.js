// server/router/__tests__/postLogin.test.js
const postLogin = require('../postLogin');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

jest.mock('../../models/User');
jest.mock('jsonwebtoken');

describe('Route: postLogin', () => {
  let req, res;

  beforeEach(() => {
    req = { body: { username: 'testuser', password: 'password123' } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  test('should return error if user not found', async () => {
    User.findOne.mockResolvedValue(null);
    await postLogin(req, res);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'User not found' });
  });

  test('should return error if password does not match', async () => {
    const user = { username: 'testuser', password: 'wrongpassword' };
    User.findOne.mockResolvedValue(user);

    await postLogin(req, res);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'Invalid password' });
  });

  test('should return token and user if login is successful', async () => {
    const user = { _id: 'user123', username: 'testuser', password: 'password123' };
    User.findOne.mockResolvedValue(user);
    jwt.sign.mockReturnValue('token123');

    await postLogin(req, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, token: 'token123', user });
  });

  test('should return 500 and error message on error', async () => {
    User.findOne.mockRejectedValue(new Error('DB error'));
    await postLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'DB error' });
  });
});
