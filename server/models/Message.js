const mongoose = require('mongoose');

// Define the Message schema
const messageSchema = new mongoose.Schema({
  channelId: { type: String, required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // Store timestamp
});

// Create and export the Message model
module.exports = mongoose.model('Message', messageSchema);
