// Require express
const express = require('express');
// Creates router
const router = express.Router();

// Require controller modules
const post_controller = require('../controllers/postController.js');

/// POST ROUTES ///

// GET request for getting all the posts
router.get('/', post_controller.post_list);

// POST request for creating new post
router.post('/', post_controller.post_create);

// PUT request for updating a post
router.put('/:id', post_controller.post_update);

// DELETE request for deleting a post
router.delete('/:id', post_controller.post_delete);

/// COMMENTS ROUTES ///

// GET all comments for a specific post
router.get('/:postId/comments', post_controller.comment_list);

// POST a new comment for a specific post
router.post('/:postId/comments', post_controller.comment_create);

// PUT update a comment for a specific post
router.put('/:postId/comments/:commentId', post_controller.comment_update);

// DELETE a comment for a specific post
router.delete('/:postId/comments/:commentId', post_controller.comment_delete);

module.exports = router;
