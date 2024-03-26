const User = require('../models/user');

// Display list of all users.
exports.user_list = (req, res, next) => {
  res.json({ message: 'GET users not implemented' });
};

// Create a new user
exports.user_create = (req, res, next) => {
  res.json({ message: 'POST user not implemented yet' });
};

// Display detail for a specific user
exports.user_detail = (req, res, next) => {
  res.json({ message: `GET user ${req.params.id} detail not implemented yet` });
};

// Handle user update on POST
exports.user_update = (req, res, next) => {
  res.json({ message: `PUT user ${req.params.id} not implemented yet` });
};

// Handle user deletion on DELETE
exports.user_delete = (req, res, next) => {
  res.json({ message: `DELETE user ${req.params.id} not implemented yet` });
};
