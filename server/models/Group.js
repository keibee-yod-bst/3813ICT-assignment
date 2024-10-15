// server/models/Group.js
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: String,
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Group', GroupSchema);
