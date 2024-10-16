// server/router/__tests__/postRegister.test.js
const postRegister = require('../postRegister');
const User = require('../../models/User');

jest.mock('../../models/User');

describe('Route: postRegister', () => {
  let req, res;

  beforeEach(() => {
    req = { body: { username: 'newuser', password: 'password123' } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  test('should create a new user and return ok', async () => {
    User.prototype.save = jest.fn().mockResolvedValue();
    await postRegister(req, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  test('should return 500 and error message on error', async () => {
    User.prototype.save = jest.fn().mockRejectedValue(new Error('DB error'));
    await postRegister(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'DB error' });
  });
});
