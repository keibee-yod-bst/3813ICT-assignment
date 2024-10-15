// server/router/postRegister.js
const User = require('../models/User');

module.exports = function (req, res) {
  const { username, password } = req.body;

  const newUser = new User({
    username,
    password, // Consider hashing the password
    roles: ['User'],
    groups: [],
  });

  newUser
    .save()
    .then(() => res.json({ ok: true }))
    .catch((err) =>
      res.status(500).json({ ok: false, error: err.message })
    );
};
