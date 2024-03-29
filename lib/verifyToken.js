const jwt = require('jsonwebtoken');
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
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
    if (err) {
      // Throw error if token doesn't match
      res
        .status(403)
        .json({ message: 'Error during authentication', error: err });
    } else {
      // Attach authorized user data to req.user
      req.user = authData;
      console.log(req.user);
      next();
    }
  });
}

module.exports = { verifyToken, jwtVerify };
