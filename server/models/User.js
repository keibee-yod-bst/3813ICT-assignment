// server/models/User.js
const { truncate } = require('fs/promises');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // No bcrypt hash
  roles: { type: [String], default: ['User'] },
  groups: { type: [String] }
});

module.exports = mongoose.model('User', UserSchema);
