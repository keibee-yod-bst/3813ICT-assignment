const PORT = 3000;
// elf port 8888 or 8080, http server and 3000 and 3001 for https
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const { ExpressPeerServer } = require('peer');
app.use(cors());

const http = require('http').Server(app);
const io = require('socket.io')(http);
const authMiddleware = require('./middleware/auth');

mongoose.connect('mongodb://localhost:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const peerServer = ExpressPeerServer(http, {
  debug: true,
  path: '/'
});

app.use(express.urlencoded({
    extend: true
  }));
  app.use(express.json());

  app.use('/peerjs', peerServer);

  app.post('/register', require('./router/postRegister'));
  app.post('/login', require('./router/postLogin'));
  app.post('/loginafter', require('./router/postLoginAfter'));

  app.post('/createGroup', authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('GroupAdmin', 'SuperAdmin'), require('./router/createGroup'));

  io.on('connection', (socket) => {
    console.log('a user connected');
  
    socket.on('joinChannel', ({ channelId }) => {
      socket.join(channelId);
    });
  
    socket.on('chatMessage', ({ channelId, message }) => {
      io.to(channelId).emit('chatMessage', message);
    });
  
    // Handle sharing of peerIds
    socket.on('sharePeerId', ({ channelId, peerId }) => {
      // Broadcast the peerId to others in the channel
      socket.to(channelId).emit('sharePeerId', { peerId });
    });
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });  

/*
  app.use(express.static(__dirname + '/www'));
  app.get('/test', function(req,res) {
    res.sendFile(__dirname + '/www/test.html');
  });
  */

  http.listen(PORT,
    () => {
        console.log('Server listening on:' + PORT);
    }
  );
/*
  console.log(__dirname);
  require('./routes/check.js').routeFunc(app);
  
  HTMLOutputElement.listen(PORT,
    () => {
      console.log("Server listening on:" + PORT);
    });
*/