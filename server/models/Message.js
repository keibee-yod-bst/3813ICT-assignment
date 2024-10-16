const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  channelId: String,
  username: String,
  message: String,
  isImage: { type: Boolean, default: false }, // Add field to differentiate messages
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
