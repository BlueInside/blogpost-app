// Requires
const debug = require('debug')('blogpost-app:database');
const mongoose = require('mongoose');

// Require configuration variables
require('dotenv').config();

// Establish connection with database
const connect = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URL is not defined');
    }
    await mongoose.connect(process.env.MONGODB_URL);
    debug('Connected to the database');
  } catch (err) {
    debug('Error connecting to the database', err.message);
    throw new Error('Failed to connect to the database');
  }
};

connect(); // Connect to the database immediately upon importing this module

// export connection
module.exports = connect;
