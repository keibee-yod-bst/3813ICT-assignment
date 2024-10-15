// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: String,
  password: String,
  roles: [String], // e.g., ['User'], ['GroupAdmin'], ['SuperAdmin']
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
});

module.exports = mongoose.model('User', UserSchema);
