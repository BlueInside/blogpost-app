#! /usr/bin/env node

console.log('This script populates some test user, posts');

const Post = require('./models/post');
const User = require('./models/user');

// Require env
require('dotenv').config();
const posts = [];
const users = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => console.log(err));

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
// user[0] will always be the the first user, regardless of the order
// in which the elements of promise.all's argument complete.
async function usersCreate(index, username, password, firstName, lastName) {
  const user = new User({
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
  });
  await user.save();
  users[index] = user;
  console.log(`Added user: ${username}`);
}

async function postCreate(author, index, title, content, isPublished) {
  const postDetails = {
    author,
    title,
    content,
    isPublished,
  };

  const post = new Post(postDetails);

  await post.save();
  posts[index] = post;
  console.log(`Added Post: ${title} ${content}`);
}

async function createUser() {
  console.log('Adding Users');
  await Promise.all([usersCreate(0, 'admin', 'admin', 'Karol', 'Pulawski')]);
}

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
