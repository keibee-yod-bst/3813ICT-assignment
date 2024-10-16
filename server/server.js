const PORT = 3000;
const PEER_PORT = 9000; // Port for PeerJS server

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');
const http = require('http');
const Message = require('./models/Message'); // Import the Message model

// Initialize Express and HTTP server
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define Express routes
app.post('/register', require('./router/postRegister'));
app.post('/login', require('./router/postLogin'));
app.post('/loginafter', require('./router/postLoginAfter'));

app.post(
  '/createGroup',
  authMiddleware.authenticateJWT,
  authMiddleware.authorizeRoles('GroupAdmin', 'SuperAdmin'),
  require('./router/createGroup')
);

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected.');

  // Handle channel join and send chat history
  socket.on('joinChannel', async ({ channelId, username }) => {
    socket.join(channelId);
    io.to(channelId).emit('userJoined', `${username} joined the channel.`);

    try {
      // Retrieve chat history from MongoDB
      const chatHistory = await Message.find({ channelId }).sort({ timestamp: 1 }).lean();
      socket.emit('chatHistory', chatHistory); // Send chat history to the user
    } catch (error) {
      console.error('Error retrieving chat history:', error);
    }
  });

  // Handle incoming chat messages and save to MongoDB
  socket.on('chatMessage', async ({ channelId, username, message }) => {
    const newMessage = new Message({ channelId, username, message });

    try {
      await newMessage.save(); // Save message to MongoDB
      io.to(channelId).emit('chatMessage', { username, message, timestamp: newMessage.timestamp });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle user leaving the channel
  socket.on('leaveChannel', ({ channelId, username }) => {
    socket.leave(channelId);
    io.to(channelId).emit('userLeft', `${username} left the channel.`);
  });

  // Handle sharing of PeerJS IDs
  socket.on('sharePeerId', ({ channelId, peerId }) => {
    socket.to(channelId).emit('sharePeerId', { peerId });
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

// Start the Express and Socket.IO server
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

// --------------------------------------------
// PeerJS Server Configuration
// --------------------------------------------

// Initialize PeerJS server on a separate port
const peerApp = express();
const peerServer = http.createServer(peerApp);

const peerExpressServer = ExpressPeerServer(peerServer, {
  debug: true,
  path: '/', // Set the PeerJS path
});

// Apply CORS to PeerJS routes
peerApp.use(cors({ origin: 'http://localhost:8080', credentials: true }));

// Mount the PeerJS server at '/peerjs'
peerApp.use('/peerjs', peerExpressServer);

// Start the PeerJS server
peerServer.listen(PEER_PORT, () => {
  console.log(`PeerJS server listening on port: ${PEER_PORT}`);
});
