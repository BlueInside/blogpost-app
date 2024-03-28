const crypto = require('crypto');
const debug = require('debug')('blogpost-app:JWT_KEY');
// Generate a random string of bytes
const secretKey = crypto.randomBytes(32).toString('hex');

// Store the secret key in an environment variable
process.env.JWT_SECRET_KEY = secretKey;

debug('JWT secret key generated and stored in process.env.JWT_SECRET_KEY');
