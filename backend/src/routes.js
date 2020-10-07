const express = require('express');
const router = express.Router();
const authController = require('./controllers/auth.controller')
const professionalController = require('./controllers/professional.controller')
const roleController = require('./controllers/role.controller')
// router.get('/', authController.findAll);


router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/token', authController.token)

// Retrieve all User
router.get('/', authController.authenticateJWT, authController.getdAll)
router.post('/', authController.authenticateJWT, authController.create)
router.put('/:id', authController.authenticateJWT, authController.update)
router.delete('/:id', authController.authenticateJWT, authController.delete)

// Retrieve roles of single group
router.get('/roles:id', roleController.getByGroupID)
// Retrieve a single User with id
router.get('/professionals', authController.authenticateJWT, professionalController.getAll)
router.post('/professionals', authController.authenticateJWT, professionalController.addNew)
router.put('/professionals/:id', authController.authenticateJWT, professionalController.update)
router.delete('/professionals/:id', authController.authenticateJWT, professionalController.delete)

// Update a User with id
// router.put('/:id', authController.update);

// Delete a User with id
// router.delete('/:id', authController.delete);


module.exports = router;