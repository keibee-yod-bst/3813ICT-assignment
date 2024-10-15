// server/models/Channel.js
const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  name: String,
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Channel', ChannelSchema);
