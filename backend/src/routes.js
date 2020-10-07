const express = require('express');
const router = express.Router();
const authController = require('./controllers/auth.controller')
const professionalController = require('./controllers/professional.controller')
const roleController = require('./controllers/role.controller')
const userGroupController = require('./controllers/usergroup.controller')

router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/token', authController.token)

// User CRUD
router.get('/', authController.authenticateJWT, authController.getdAll)
router.post('/', authController.authenticateJWT, authController.create)
router.put('/:id', authController.authenticateJWT, authController.update)
router.delete('/:id', authController.authenticateJWT, authController.delete)

// Retrieve all roles
router.get('/roles', authController.authenticateJWT, roleController.getAll)


//Retrieve all user group with their roles
router.get('/usergroups', authController.authenticateJWT, userGroupController.getAll)
router.get('/group-together', authController.authenticateJWT, userGroupController.getTogether)

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