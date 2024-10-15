// server/router/postRegister.js
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = function(req, res) {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hashedPassword => {
      const user = new User({
        username,
        email,
        password: hashedPassword,
        roles: ['User'],
        groups: []
      });
      return user.save();
    })
    .then(user => res.json({ ok: true, user }))
    .catch(err => res.status(400).json({ ok: false, error: err.message }));
};
