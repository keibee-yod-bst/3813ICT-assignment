// server/__tests__/socket.test.js
const io = require('socket.io-client');
const http = require('http'); // Use HTTP server to wrap the express app
const express = require('express');
const Message = require('../models/Message'); // Mock Message model
const socketIO = require('socket.io'); // Import socket.io
const app = express(); // Create an express app

jest.mock('../models/Message'); // Mock the Message model

describe('Socket.IO Events', () => {
  let server, ioServer, clientSocket;

  // Setup HTTP and Socket.IO server before all tests
  beforeAll((done) => {
    const httpServer = http.createServer(app); // Wrap express app in HTTP server
    ioServer = socketIO(httpServer); // Initialize Socket.IO on the HTTP server

    // Example socket event handler (adjust based on your actual implementation)
    ioServer.on('connection', (socket) => {
      socket.on('joinChannel', async ({ channelId, username }) => {
        const messages = await Message.find({ channelId }).sort({ timestamp: 1 }).lean();
        socket.emit('chatHistory', messages);
      });

      socket.on('chatMessage', (data) => {
        ioServer.to(data.channelId).emit('chatMessage', data);
      });
    });

    server = httpServer.listen(3001, done); // Start the server on port 3001
  });

  // Close server and clean up after all tests
  afterAll((done) => {
    ioServer.close(); // Close Socket.IO server
    server.close(done); // Close HTTP server
  });

  // Connect a new client before each test
  beforeEach((done) => {
    clientSocket = io.connect('http://localhost:3001', {
      forceNew: true, // Force a new connection for each test
    });
    clientSocket.on('connect', done); // Wait for connection
  });

  // Disconnect the client after each test
  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect(); // Disconnect the socket
    }
    done();
  });

  test('should join a channel and receive chat history', (done) => {
    const mockMessages = [{ username: 'user1', message: 'Hello', timestamp: new Date() }];
    Message.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockMessages),
    });

    clientSocket.emit('joinChannel', { channelId: 'channel123', username: 'testuser' });
    clientSocket.on('chatHistory', (messages) => {
      expect(messages).toEqual(mockMessages); // Assert that chat history is correct
      done();
    });
  });

  test('should receive chat message', (done) => {
    const chatMessage = { channelId: 'channel123', username: 'testuser', message: 'Hi' };

    clientSocket.emit('chatMessage', chatMessage);
    clientSocket.on('chatMessage', (msg) => {
      expect(msg).toEqual(chatMessage); // Assert that the message is received
      done();
    });
  });
});
