// Require models
const Post = require('../models/post');
const Comment = require('../models/comment');

/// POST CONTROLLER FUNCTION ///

// Display list of all posts.
exports.post_list = (req, res, next) => {
  res.json({ message: 'GET posts not implemented' });
};

// Create a new post
exports.post_create = (req, res, next) => {
  res.json({ message: 'POST post not implemented yet' });
};

// Display detail for a specific post
exports.post_detail = (req, res, next) => {
  res.json({ message: `GET post ${req.params.id} detail not implemented yet` });
};

// Handle post update on POST
exports.post_update = (req, res, next) => {
  res.json({ message: `PUT post ${req.params.id} not implemented yet` });
};

// Handle post deletion on DELETE
exports.post_delete = (req, res, next) => {
  res.json({ message: `DELETE post ${req.params.id} not implemented yet` });
};

/// COMMENT CONTROLLER FUNCTIONS

// Display list of all comments.
exports.comment_list = (req, res, next) => {
  res.json({
    message: `GET all comments for post ${req.params.postId} not implemented`,
  });
};

// Create a new comment
exports.comment_create = (req, res, next) => {
  res.json({
    message: `POST comment for post ${req.params.postId} not implemented yet`,
  });
};

// Display detail for a specific comment
exports.comment_detail = (req, res, next) => {
  res.json({
    message: `GET comment ${req.params.id} detail for post ${req.params.postId} not implemented yet`,
  });
};

// Handle comment update on POST
exports.comment_update = (req, res, next) => {
  res.json({
    message: `PUT comment ${req.params.id} for post ${req.params.postId} not implemented yet`,
  });
};

// Handle comment deletion on DELETE
exports.comment_delete = (req, res, next) => {
  res.json({
    message: `DELETE comment ${req.params.id} for post ${req.params.postId} not implemented yet`,
  });
};
