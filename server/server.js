const PORT = 3000;
const PEER_PORT = 9000; // Port for PeerJS server

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');
const http = require('http');
const Message = require('./models/Message'); // Import the Message model
const multer = require('multer');
const path = require('path');

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
  .connect('mongodb://localhost:27017/chatapp', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Apply CORS to Express routes
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure Multer to store files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Route to upload profile images
app.post('/upload-profile', upload.single('profileImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ imagePath: filePath });
});

// Route to upload image messages
app.post('/upload-chat-image', upload.single('chatImage'), async (req, res) => {
  const { channelId, username } = req.body;
  const imagePath = `/uploads/${req.file.filename}`;

  const newMessage = new Message({ 
    channelId, 
    username, 
    message: imagePath, 
    isImage: true 
  });

  try {
    await newMessage.save();
    io.to(channelId).emit('chatMessage', {
      username,
      message: imagePath,
      isImage: true,
      timestamp: newMessage.timestamp,
    });
    res.status(200).send('Image message sent.');
  } catch (error) {
    console.error('Error saving image message:', error);
    res.status(500).send('Failed to send image message.');
  }
});

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

  socket.on('joinChannel', async ({ channelId, username }) => {
    try {
      socket.join(channelId);
      const user = { username, peerId: socket.id };
      io.to(channelId).emit('userJoined', user);

      // Retrieve chat history from MongoDB
      const chatHistory = await Message.find({ channelId })
        .sort({ timestamp: 1 })
        .lean();
      socket.emit('chatHistory', chatHistory); // Send chat history to the user
    } catch (error) {
      console.error('Error retrieving chat history:', error);
    }
  });

  // Handle incoming chat messages and save to MongoDB
  // Handle incoming chat messages and save to MongoDB
socket.on('chatMessage', async ({ channelId, username, message, isImage = false }) => {
  const newMessage = new Message({ channelId, username, message, isImage });

  try {
    await newMessage.save(); // Save message to MongoDB
    io.to(channelId).emit('chatMessage', {
      username,
      message,
      isImage,
      timestamp: newMessage.timestamp,
    });
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

module.exports = server;