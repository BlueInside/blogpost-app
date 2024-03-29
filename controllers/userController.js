// Requires
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const authenticateUser = require('../lib/authenticate');
const mongoose = require('mongoose');
// Require dotenv
require('dotenv').config();

// Display list of all users.
exports.user_list = asyncHandler(async (req, res, next) => {
  const users = await User.find({}).sort({ username: 1 }).exec();
  res.json({ users });
});

// Create a new user
exports.user_create = [
  // Run validation and sanitization
  body('username') // Checks username
    .trim()
    .notEmpty()
    .withMessage('Username field cannot be empty')
    .custom(async (value) => {
      // Checks if username is already taken
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error('Username already taken');
      }
    })
    .escape(),
  body('password') // Checks password
    .trim()
    .notEmpty()
    .withMessage('Password field cannot be empty')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters long')
    .escape(),
  body('firstName') // Checks firstName field
    .trim()
    .notEmpty()
    .withMessage('First name field cannot be empty')
    .escape(),
  body('lastName') // Checks lastName field
    .trim()
    .notEmpty()
    .withMessage('Last name field cannot be empty')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Display error message if happened during validation
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Creates new user Model
    const newUser = User({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    // Save new user to DB
    const savedUser = await newUser.save();

    res.status(201).json(savedUser); // Return created user object
  }),
];

// Handle user login on POST
exports.user_login = [
  body('username').trim().escape(),
  body('password').trim().escape(),
  authenticateUser,
  (req, res) => {
    res.json({ token: res.token });
  },
];

// Display detail for a specific user
exports.user_detail = asyncHandler(async (req, res, next) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);

  if (!isValidId) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json(`User not found`);
  }
  res.json(user);
});

// Handle user update on PUT
exports.user_update = [
  // Validate and sanitize inputs
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username field cannot be empty')
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user && user.username !== value) {
        // Check if the retrieved user's username is different from the provided value
        throw new Error('Username is already taken!');
      }
    })
    .withMessage('Username already taken')
    .escape(),
  body('password').trim().escape(),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name field cannot be empty.')
    .escape(),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name field cannot be empty. ')
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Checks for errors during validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Sends validation errors
      return res.status(400).json({ error: errors.array() });
    }

    // Hash password if user wants to change it
    if (req.body.password) {
      // Hash password using bcrypt
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }

    // Update user TODO READ JWT payload don't user req.params.id
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true, // Option that returns updated document
        }
      );
    } catch (err) {
      res.json({ message: 'USE JWT PAYLOAD' }); // REMOVE when using jwt payload
    }

    // If user not found, return 404
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  }),
];

// Handle user deletion on DELETE
exports.user_delete = (req, res, next) => {
  res.json({ message: `DELETE user ${req.params.id} not implemented yet` });
};
