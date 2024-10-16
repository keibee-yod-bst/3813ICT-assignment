// server/router/__tests__/postLoginAfter.test.js
const postLoginAfter = require('../postLoginAfter');
const fs = require('fs');

jest.mock('fs');

describe('Route: postLoginAfter', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        userid: 'user123',
        username: 'testuser',
        userbirthdate: '1990-01-01',
        userage: 30,
      },
    };
    res = {
      send: jest.fn(),
    };
  });

  test('should read users file and update user', () => {
    const data = JSON.stringify([
      { username: 'olduser', userid: 'user456' },
    ]);
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, data);
    });
    fs.writeFile.mockImplementation((path, data, encoding, callback) => {
      callback(null);
    });

    return new Promise((resolve) => {
      postLoginAfter(req, res);
      process.nextTick(() => {
        expect(fs.readFile).toHaveBeenCalledWith(
          './data/extendedUsers.json',
          'utf8',
          expect.any(Function)
        );
        expect(res.send).toHaveBeenCalled();
        resolve();
      });
    });
  });

  test('should handle readFile error', () => {
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(new Error('Read error'));
    });

    expect(() => postLoginAfter(req, res)).toThrow('Read error');
  });

  test('should handle writeFile error', () => {
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, '[]');
    });
    fs.writeFile.mockImplementation((path, data, encoding, callback) => {
      callback(new Error('Write error'));
    });

    expect(() => postLoginAfter(req, res)).toThrow('Write error');
  });
});
