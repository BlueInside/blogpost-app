const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({
    message: 'Welcome to the BlogPost API!',
    description:
      'This API provides endpoints for managing blog posts and comments.',
    endpoints: [
      {
        method: 'GET',
        path: '/posts',
        description: 'Retrieve all blog posts',
      },
      {
        method: 'GET',
        path: '/posts/:id',
        description: 'Retrieve a specific blog post by ID',
      },
      {
        method: 'POST',
        path: '/posts',
        description: 'Create a new blog post',
      },
      {
        method: 'PUT',
        path: '/posts/:id',
        description: 'Update a specific blog post by ID',
      },
      {
        method: 'DELETE',
        path: '/posts/:id',
        description: 'Delete a specific blog post by ID',
      },
      {
        method: 'GET',
        path: '/posts/:id/comments',
        description: 'Retrieve comments for a specific blog post',
      },
      {
        method: 'GET',
        path: '/comments',
        description: 'Retrieve all comments',
      },
      {
        method: 'GET',
        path: '/comments/:id',
        description: 'Retrieve a specific comment by ID',
      },
      {
        method: 'POST',
        path: '/comments',
        description: 'Create a new comment',
      },
      {
        method: 'PUT',
        path: '/comments/:id',
        description: 'Update a specific comment by ID',
      },
      {
        method: 'DELETE',
        path: '/comments/:id',
        description: 'Delete a specific comment by ID',
      },
    ],
    documentation: '/documentation',
  });
});

module.exports = router;
