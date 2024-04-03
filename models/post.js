// Requires
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { format } = require('date-fns');

// Defines Schema
const postSchema = new Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    title: { type: String, required: true, minLength: 3 },
    content: { type: String, required: true, minLength: 3 },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }], // Reference to the Comment model
    timeStamp: { type: Date, default: Date.now, required: true }, // Creates timestamp, default to current time
    isPublished: { type: Boolean, default: false }, // Only isPublished === true posts will be visible to users
  },
  { toJSON: { virtuals: true } }
);

// Pre save operations

// Removes all attached comments on post remove
postSchema.pre('remove', async function (next) {
  try {
    await mongoose.model('Comment').deleteMany({ post: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

postSchema.pre('save', function (next) {
  // Capitalize first letter in title
  this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
  next();
});

// Virtual properties
postSchema.virtual('url').get(function () {
  return `/posts/${this._id}`; // returns link to specific post
});

// Format date using date-fns, formats to, example: (12:40 26 Mar 2024)
postSchema.virtual('formattedTimeStamp').get(function () {
  const formattedDate = format(this.timeStamp, 'kk:mm d MMM y');
  return formattedDate;
});

//Exports
module.exports = mongoose.model('Post', postSchema);
