// server/router/__tests__/createGroup.test.js
const createGroup = require('../createGroup');
const Group = require('../../models/Group');

jest.mock('../../models/Group');

describe('Route: createGroup', () => {
  let req, res;

  beforeEach(() => {
    req = { body: { name: 'Test Group' }, user: { _id: 'user123' } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  test('should create a new group and return it', async () => {
    const group = { _id: 'group123', name: 'Test Group', admins: ['user123'], users: ['user123'] };
    Group.prototype.save = jest.fn().mockResolvedValue(group);

    await createGroup(req, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, group });
  });

  test('should return 500 and error message on error', async () => {
    Group.prototype.save = jest.fn().mockRejectedValue(new Error('DB error'));
    await createGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'DB error' });
  });
});
