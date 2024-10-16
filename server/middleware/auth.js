// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = 'your_secret_key'; // Use environment variables in production

module.exports.authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.userId);
    if (!user) return res.sendStatus(401);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      res.sendStatus(403);
    } else {
      res.sendStatus(500);
    }
  }
};

module.exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    const hasRole = req.user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) return res.sendStatus(403);
    next();
  };
};
