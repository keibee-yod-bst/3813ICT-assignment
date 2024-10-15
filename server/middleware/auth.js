// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = 'your_secret_key'; // Use environment variables in production

module.exports.authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.sendStatus(403);
    User.findById(decoded.userId)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => res.sendStatus(500));
  });
};

module.exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    const hasRole = req.user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) return res.sendStatus(403);
    next();
  };
};
