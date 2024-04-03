const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    next();
  } else {
    // Forbidden
    return res
      .status(404)
      .json({ message: 'Not enough permission to access the endpoint' });
  }
}

// Verify token using JWT
function jwtVerify(req, res, next) {
  // Verify req.token
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      // Throw error if token doesn't match
      return res
        .status(403)
        .json({ message: 'Error during authentication', error: err });
    } else {
      // Attach authorized user data to req.user
      req.user = authData.user;
      next();
    }
  });
}

// verifies if users exist use if decide to have multiple users
async function verifyUserExist(req, res, next) {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found!' });
  }
  next();
}

module.exports = { verifyToken, jwtVerify };
