// server/__tests__/server.test.js
const request = require('supertest');
const express = require('express');
const User = require('../models/User');
const Group = require('../models/Group');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock('../models/Group');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mock routes
app.post('/register', require('../router/postRegister'));
app.post('/login', require('../router/postLogin'));
app.post(
  '/createGroup',
  (req, res, next) => {
    req.user = { roles: ['SuperAdmin'], _id: 'user123' };
    next();
  },
  require('../router/createGroup')
);

describe('Server Routes', () => {
  describe('POST /register', () => {
    test('should register a new user', async () => {
      User.prototype.save = jest.fn().mockResolvedValue();
      const response = await request(app)
        .post('/register')
        .send({ username: 'testuser', password: 'password123' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
    });

    test('should return 500 on error', async () => {
      User.prototype.save = jest.fn().mockRejectedValue(new Error('DB error'));
      const response = await request(app)
        .post('/register')
        .send({ username: 'testuser', password: 'password123' });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ ok: false, error: 'DB error' });
    });
  });

  describe('POST /login', () => {
    test('should login a user', async () => {
      const user = { _id: 'user123', username: 'testuser', password: 'password123' };
      User.findOne.mockResolvedValue(user);
      jwt.sign.mockReturnValue('token123');
      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true, token: 'token123', user });
    });
  });

  describe('POST /createGroup', () => {
    test('should create a new group', async () => {
      Group.prototype.save = jest.fn().mockResolvedValue({
        _id: 'group123',
        name: 'New Group',
        admins: ['user123'],
        users: ['user123'],
      });
      const response = await request(app)
        .post('/createGroup')
        .send({ name: 'New Group' });
      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.group.name).toBe('New Group');
    });
  });
});
