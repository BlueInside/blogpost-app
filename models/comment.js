// Requires
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { format } = require('date-fns');

// Defines comment Schema
const commentSchema = new Schema({
  post: { type: mongoose.Types.ObjectId, required: true },
  username: { type: String, default: 'Anonymous' }, // If no username provided, use "Anonymous"
  text: { type: String, required: true, minLength: 3 },
  timeStamp: { type: Date, default: Date.now, required: true }, // Timestamp use current date as time
});

// Virtual properties
commentSchema.virtual('formattedTimeStamp').get(function () {
  const formattedDate = format(this.timeStamp, 'd MMM y'); // Format date using date-fns, formats to, example: (26 Mar 2024)
  return formattedDate;
});

// Exports
module.exports = mongoose.model('Comment', commentSchema);
