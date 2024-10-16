// server/router/__tests__/createChannel.test.js
const createChannel = require('../createChannel');
const Channel = require('../../models/Channel');
const Group = require('../../models/Group');

jest.mock('../../models/Channel');
jest.mock('../../models/Group');

describe('Route: createChannel', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        groupId: 'group123',
        name: 'New Channel',
      },
      user: {
        _id: 'user123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should return 403 if user is not an admin of the group', async () => {
    Group.findOne.mockResolvedValue(null);
    await createChannel(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'Not authorized' });
  });

  test('should create a new channel and update group', async () => {
    const group = {
      _id: 'group123',
      users: ['user123', 'user456'],
      channels: [],
      save: jest.fn().mockResolvedValue(),
    };
    const channel = {
      _id: 'channel123',
      save: jest.fn().mockResolvedValue({ _id: 'channel123' }),
    };
    Group.findOne.mockResolvedValue(group);
    Channel.mockImplementation(() => channel);

    await createChannel(req, res);

    expect(group.channels).toContain('channel123');
    expect(res.json).toHaveBeenCalledWith({ ok: true, channel: { _id: 'channel123' } });
  });

  test('should return 500 and error message on error', async () => {
    Group.findOne.mockRejectedValue(new Error('DB error'));
    await createChannel(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'DB error' });
  });
});
