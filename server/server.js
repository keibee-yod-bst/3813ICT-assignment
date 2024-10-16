// server.js

const PORT = 3000;
const PEER_PORT = 9000; // Port for PeerJS server

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

const authMiddleware = require('./middleware/auth');

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/chatapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Apply CORS to Express routes
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));

// Middleware for parsing JSON and URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define routes
app.post('/register', require('./router/postRegister'));
app.post('/login', require('./router/postLogin'));
app.post('/loginafter', require('./router/postLoginAfter'));

app.post(
  '/createGroup',
  authMiddleware.authenticateJWT,
  authMiddleware.authorizeRoles('GroupAdmin', 'SuperAdmin'),
  require('./router/createGroup')
);

// Handle Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected.');

  socket.on('joinChannel', ({ channelId }) => {
    socket.join(channelId);
  });

  socket.on('chatMessage', ({ channelId, message }) => {
    io.to(channelId).emit('chatMessage', message);
  });

  socket.on('sharePeerId', ({ channelId, peerId }) => {
    socket.to(channelId).emit('sharePeerId', { peerId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected.');
  });
});

// Start the main Express and Socket.IO server
server.listen(PORT, () => {
  console.log('Server listening on port: ' + PORT);
});

// --------------------------------------------
// Start the PeerJS server on a separate port
// --------------------------------------------

// Initialize the PeerJS server on a separate port
const peerApp = express();
const peerServer = http.createServer(peerApp);

const peerExpressServer = ExpressPeerServer(peerServer, {
  debug: true,
  path: '/', // Set the path to root
});

// Apply CORS to PeerJS routes
peerApp.use(cors({ origin: 'http://localhost:8080', credentials: true }));

// Mount the PeerJS server at '/peerjs'
peerApp.use('/peerjs', peerExpressServer);

// Start the PeerJS server
peerServer.listen(PEER_PORT, () => {
  console.log('PeerJS server listening on port: ' + PEER_PORT);
});
