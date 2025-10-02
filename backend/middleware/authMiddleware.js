const jwt = require('jsonwebtoken');
require('dotenv').config();

const authentication = (req, res, next) => {
  const token = req.cookies?.token; // replace with actual cookie name
console.log(token)
  if (!req.cookies || !token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please log in again' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user; // attach decoded token payload to request
    next();
  });
};

module.exports = authentication;
