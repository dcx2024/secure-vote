const jwt = require('jsonwebtoken');
require('dotenv').config();

const authentication = (req, res, next) => {
  const token = req.cookies?.token; // Replace with your cookie name if different

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please log in again' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

const voterAuth = (req, res, next) => {
  const token = req.cookies?.voterToken;

  if (!token) {
    
    return res.redirect('/');
  }

  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please log in again' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

module.exports = { authentication, voterAuth };
