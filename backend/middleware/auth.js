const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    }
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch (error) {
    req.user = null;
  }
  next();
};

module.exports = { protect, optionalAuth };
