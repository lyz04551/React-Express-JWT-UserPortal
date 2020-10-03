const express = require('express');
const router = express.Router();
const authController = require('./controllers/auth.controller')

// Retrieve all User
// router.get('/', authController.findAll);

// Create a new User
router.post('/', authController.create);

router.post('/login', authController.login);
router.post('/token', authController.token);
// Retrieve a single User with id

// Update a User with id
// router.put('/:id', authController.update);

// Delete a User with id
// router.delete('/:id', authController.delete);

module.exports = router;