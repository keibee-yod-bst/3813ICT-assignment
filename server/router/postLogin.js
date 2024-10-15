// server/router/postLogin.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = 'your_secret_key'; // Use environment variables in production

module.exports = function (req, res) {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) return res.json({ ok: false, error: 'User not found' });

      if (password !== user.password) {
        return res.json({ ok: false, error: 'Invalid password' });
      }

      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: '1h',
      });
      res.json({ ok: true, token, user });
    })
    .catch((err) => res.status(500).json({ ok: false, error: err.message }));
};
