// Require express
const express = require('express');

// Creates router
const router = express.Router();

// Requires functions to verifyToken and jwtVerify
const { verifyToken, jwtVerify } = require('../lib/verifyToken.js');

// Require controller modules
const user_controller = require('../controllers/userController.js');

/// User ROUTES ///

// GET request for getting all the users requires JWT TOKEN
router.get('/', verifyToken, jwtVerify, user_controller.user_list);

// POST request for creating new user
router.post('/', verifyToken, jwtVerify, user_controller.user_create);

// GET request to get user info requires JWT TOKEN
router.get('/:id', verifyToken, jwtVerify, user_controller.user_detail);

// PUT request for updating a user requires JWT TOKEN and uses id from it to update user
router.put('/:id', verifyToken, jwtVerify, user_controller.user_update);

// DELETE request for deleting a user requires JWT TOKEN
router.delete('/:id', verifyToken, jwtVerify, user_controller.user_delete);

// POST request for logging a user
router.post('/login', user_controller.user_login);

module.exports = router;
