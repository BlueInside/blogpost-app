// Require express
const express = require('express');
// Creates router
const router = express.Router();

// Require controller modules
const user_controller = require('../controllers/userController.js');

/// GET ROUTES ///

// GET request for getting all the users
router.get('/', user_controller.user_list);

// POST request for creating new user
router.post('/', user_controller.user_create);

// PUT request for updating a user
router.put('/:id', user_controller.user_update);

// DELETE request for deleting a user
router.delete('/:id', user_controller.user_delete);

module.exports = router;
