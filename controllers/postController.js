// Requires
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// require .env file
require('dotenv').config();

// Require models
const Post = require('../models/post');
const Comment = require('../models/comment');

/// POST CONTROLLER FUNCTION ///

// Display list of all posts.
exports.post_list = asyncHandler(async (req, res, next) => {
  // Use asyncHandler to catch any errors that occur during asynchronous operations

  const posts = await Post.find(); // Use Mongoose's find() method to retrieve all posts from the database
  res.json(posts); // Send the retrieved posts as a JSON response
});

// Create a new post TODO JWT VALIDATION
exports.post_create = [
  // Validate and sanitize body payload
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title field cannot be empty')
    .escape(),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content field cannot be empty')
    .escape(),
  body('isPublished')
    .isBoolean()
    .withMessage('isPublished must be boolean value'),

  asyncHandler(async (req, res, next) => {
    // Get user id from JWT authentication,
    const authorId = process.env.AUTHOR_ID;
    const errors = validationResult(req);
    console.log(req.body, authorId);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Create new post
    const post = Post({
      author: authorId,
      title: req.body.title,
      content: req.body.content,
      isPublished: req.body.isPublished,
    });

    // Save the post to the database
    const savedPost = await post.save();

    res.status(201).json(savedPost);
  }),
];

// Display detail for a specific post
exports.post_detail = asyncHandler(async (req, res, next) => {
  res.json({ message: `GET post ${req.params.id} detail not implemented yet` });
});

// Handle post update on POST
exports.post_update = asyncHandler(async (req, res, next) => {
  res.json({ message: `PUT post ${req.params.id} not implemented yet` });
});

// Handle post deletion on DELETE
exports.post_delete = asyncHandler(async (req, res, next) => {
  res.json({ message: `DELETE post ${req.params.id} not implemented yet` });
});
/// COMMENT CONTROLLER FUNCTIONS

// Display list of all comments.
exports.comment_list = asyncHandler(async (req, res, next) => {
  res.json({
    message: `GET all comments for post ${req.params.postId} not implemented`,
  });
});

// Create a new comment
exports.comment_create = asyncHandler(async (req, res, next) => {
  res.json({
    message: `POST comment for post ${req.params.postId} not implemented yet`,
  });
});

// Display detail for a specific comment
exports.comment_detail = asyncHandler(async (req, res, next) => {
  res.json({
    message: `GET comment ${req.params.id} detail for post ${req.params.postId} not implemented yet`,
  });
});

// Handle comment update on POST
exports.comment_update = asyncHandler(async (req, res, next) => {
  res.json({
    message: `PUT comment ${req.params.id} for post ${req.params.postId} not implemented yet`,
  });
});

// Handle comment deletion on DELETE
exports.comment_delete = asyncHandler(async (req, res, next) => {
  res.json({
    message: `DELETE comment ${req.params.id} for post ${req.params.postId} not implemented yet`,
  });
});
