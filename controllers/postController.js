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

  const posts = await Post.find().populate({
    path: 'author',
    select: 'firstName lastName',
  }); // Use Mongoose's find() method to retrieve all posts from the database
  res.json(posts); // Send the retrieved posts as a JSON response
});

exports.post_create = [
  // Validate and sanitize body payload
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title field cannot be empty')
    .isLength({
      min: 3,
    })
    .withMessage('Must be longer than 3 characters')
    .escape(),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content field cannot be empty')
    .isLength({
      min: 3,
    })
    .withMessage('Must be longer than 3 characters')
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
  const post = await Post.findById(req.params.id).populate({
    path: 'author',
    select: 'firstName lastName',
  });
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
  body('isPublished').isBoolean().withMessage('isPublished must be bool value'),

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
  // Checks if id is valid mongoose ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  // Deletes post
  const deletedPost = await Post.findByIdAndDelete(req.params.id);

  // Throws error when post not found
  if (!deletedPost) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Return confirmation on deletion
  res.json({ message: 'Post successfully deleted' });
});

/// COMMENT CONTROLLER FUNCTIONS

// Display list of all comments for specific post.
exports.comment_list = asyncHandler(async (req, res, next) => {
  // Check if id is valid
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.postId);
  if (!isValidId) {
    return res.status(400).json({ message: 'Invalid comment id' }); // Return 404 if comment id is invalid
  }

  // Check DB for comments
  const comments = await Comment.find({ postId: req.params.postId })
    .sort({ timeStamp: -1 }) // Sort them from the latest to the oldest
    .exec();
  // Return comments
  res.json(comments);
});

// Create a new comment and assign to specific post.
exports.comment_create = [
  body('username').trim().escape(),
  body('text')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Text must be at least 3 characters long')
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Checks for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Send errors
      return res
        .status(400)
        .json({ message: 'Validation error', error: errors.array() });
    }

    // Create comment model
    const comment = Comment({
      postId: req.params.postId,
      username: req.body.username === '' ? 'Anonymous' : req.body.username,
      text: req.body.text,
    });
    // Saves the comment
    const savedComment = await comment.save();
    console.log(savedComment);
    // Finds a post by id
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push(savedComment._id);
    // save the post with updated comments
    await post.save();

    return res.status(201).json(savedComment);
  }),
];

// Display detail for a specific comment
exports.comment_detail = asyncHandler(async (req, res, next) => {
  // Check if id is valid
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.commentId);
  if (!isValidId) {
    return res.status(400).json({ message: 'Invalid comment id' }); // Return 404 if comment id is invalid
  }

  // Find specific comment
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    // Sends 404 if no comment found
    res.status(404).json({ message: 'Comment not found' });
  }

  // Send comment
  res.json(comment);
});

// Handle comment update on POST
exports.comment_update = [
  body('username').trim().escape(),
  body('text')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Text field cannot be shorter than 3 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Check if the comment ID is valid
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.commentId);
    if (!isValidId) {
      return res.status(400).json({ message: 'Invalid comment id' });
    }

    // Checks for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Validation error', error: errors.array() });
    }
    // Update comment in DB
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      req.body,
      { new: true } // Returns updated document
    );
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' }); // Sends 404 status code if no comment found
    }
    res.json(updatedComment); // Send updated comment
  }),
];

// Handle comment deletion on DELETE
exports.comment_delete = asyncHandler(async (req, res, next) => {
  // const check id
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.commentId);
  if (!isValidId) {
    return res.status(400).json({ message: 'Invalid comment ID' });
  }
  // USE JWT Payload USING PARAMS FOR TESTING
  const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
  if (!deletedComment) {
    res.status(404).json({ message: 'Comment not found' });
  }
  res.json(deletedComment);
});
