// Requires
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

// Defines user schema
const userSchema = new Schema({
  username: { type: String, required: true, minLength: 1 },
  password: { type: String, required: true, minLength: 5 }, // Hashed password
  firstName: { type: String, required: true, minLength: 1 },
  lastName: { type: String, required: true, minLength: 1 },
});

// Virtual properties
userSchema.virtual('fullname').get(() => {
  return `${firstName} ${lastName}`; // Virtual property for the full name of the user
});

// Exports
module.exports = mongoose.model('User', userSchema);
