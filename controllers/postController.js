// Requires
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
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
  // Validate req.params.id as a valid mongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  // Find the post by ID
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({ message: 'Post not found' });
  } else {
    // If the post is found return it
    res.json(post);
  }
});

// Handle post update on PUT
exports.post_update = [
  // Validate and sanitize inputs that can be edited
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title field must not be empty')
    .isLength({
      min: 3,
    })
    .withMessage('Must be longer than 3 characters')
    .escape(),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content field must not be empty')
    .isLength({
      min: 3,
    })
    .withMessage('Must be longer than 3 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // Checks for errors
    if (!errors.isEmpty()) {
      // If error send 400 and errors as array
      return res.status(400).json({ errors: errors.array() });
    }

    // Update post in database
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }); // Update document, and return modified version

    if (!updatedPost) {
      // Return not found message
      return res.status(404).json({ message: 'Post not found' });
    }

    // Return updated post
    return res.json(updatedPost);
  }),
];

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
