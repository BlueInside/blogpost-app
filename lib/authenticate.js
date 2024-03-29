const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = asyncHandler(async (req, res, next) => {
  // Find user in the database by username
  const user = await User.findOne({ username: req.body.username });

  // Check if user exists
  if (!user) {
    return res.status(400).json({ error: 'Invalid username or password.' });
  }

  // Compare passwords
  const match = await bcrypt.compare(req.body.password, user.password);

  // If passwords don't match, return error
  if (!match) {
    return res.status(400).json({ error: 'Invalid username or password.' });
  }

  // Sign JWT token
  jwt.sign(
    { user },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '2d' }, // Token expires in 2 days
    (err, token) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create token' });
      }
      // Attach the token to the response
      res.token = token;
      next();
    }
  );
});

// exports
module.exports = authenticateUser;
