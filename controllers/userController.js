// Requires
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// Display list of all users.
exports.user_list = asyncHandler(async (req, res, next) => {
  const users = await User.find({}).sort({ username: 1 }).exec();
  res.json({ users });
});

// Create a new user
exports.user_create = [
  // Run validation and sanitization
  body('username')
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
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password field cannot be empty')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters long')
    .escape(),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name field cannot be empty')
    .escape(),
  body('lastName')
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
exports.user_login = asyncHandler(async (req, res, next) => {
  res.json({ message: 'Implement user login' });
});

// Display detail for a specific user
exports.user_detail = (req, res, next) => {
  res.json({ message: `GET user ${req.params.id} detail not implemented yet` });
};

// Handle user update on PUT
exports.user_update = (req, res, next) => {
  res.json({ message: `PUT user ${req.params.id} not implemented yet` });
};

// Handle user deletion on DELETE
exports.user_delete = (req, res, next) => {
  res.json({ message: `DELETE user ${req.params.id} not implemented yet` });
};
