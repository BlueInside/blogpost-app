#! /usr/bin/env node

console.log('This script populates some test user, posts');

// Require Post and Users models
const Post = require('./models/post');
const User = require('./models/user');

// Require env
require('dotenv').config();

// Save mongoose posts and users objects in arrays
const posts = [];
const users = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Call main function and console any errors
main().catch((err) => console.log(err));

// Main function connects to DB and populate db
async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Debug: Should be connected?');
  await createUser();
  await createPosts();

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// post[0] will always be the the first post, regardless of the order
// in which the elements of promise.all's argument complete.
async function usersCreate(index, username, password, firstName, lastName) {
  const user = new User({
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
  });

  // Saves it to DB
  await user.save();

  // Add mongo object reference to users array
  users[index] = user;

  // Logs created user
  console.log(`Added user: ${username}`);
}

// Creates posts
async function postCreate(author, index, title, content, isPublished) {
  const postDetails = {
    author,
    title,
    content,
    isPublished,
  };

  const post = new Post(postDetails);

  // Saves it to DB
  await post.save();

  // Add mongo object reference to posts array
  posts[index] = post;

  // Logs successfully added post
  console.log(`Added Post: ${title} ${content}`);
}

// Creates users
async function createUser() {
  console.log('Adding Users');
  await Promise.all([usersCreate(0, 'admin', 'admin', 'Karol', 'Pulawski')]);
}

// Creates posts
async function createPosts() {
  console.log('Adding Posts');
  await Promise.all([
    // First post
    postCreate(
      users[0]._id,
      0,
      'First Post',
      'This is the content of the first post.',
      true
    ),
    // Second post
    postCreate(
      users[0]._id,
      1,
      'Second Post',
      'This is the content of the second post.',
      true
    ),
    // Third post
    postCreate(
      users[0]._id,
      2,
      'Third Post',
      'This is the content of the third post.',
      true
    ),
    // Fourth post
    postCreate(
      users[0]._id,
      3,
      'Fourth Post',
      'This is the content of the fourth post.',
      true
    ),
    // Fifth post
    postCreate(
      users[0]._id,
      4,
      'Fifth Post',
      'This is the content of the fifth post.',
      true
    ),
  ]);
}
