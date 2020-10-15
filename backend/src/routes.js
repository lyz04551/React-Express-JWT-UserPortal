const express = require('express');
const router = express.Router();
const authController = require('./controllers/auth.controller')
const professionalController = require('./controllers/professional.controller')
const roleController = require('./controllers/role.controller')
const userGroupController = require('./controllers/usergroup.controller')
const patientController = require('./controllers/patient.controller')
const categoryController = require('./controllers/category.controller')
const licenseController = require('./controllers/license.controller')

router.post('/login', authController.login)
router.post('/logout', authController.logout)
// router.post('/token', authController.token)

// User CRUD
router.get('/', authController.authenticateJWT, authController.getdAll)
router.post('/', authController.authenticateJWT, authController.addNew)
router.put('/:id', authController.authenticateJWT, authController.update)
router.delete('/:id', authController.authenticateJWT, authController.delete)

// Retrieve all roles
router.get('/roles', authController.authenticateJWT, roleController.getAll)


router.get('/usergroup-list', authController.authenticateJWT, userGroupController.getList)
router.get('/usergroup', authController.authenticateJWT, userGroupController.getAll)
router.post('/usergroup', authController.authenticateJWT, userGroupController.addNew)
router.delete('/usergroup/:id', authController.authenticateJWT, userGroupController.delete)
router.put('/usergroup/:id', authController.authenticateJWT, userGroupController.update)

router.get('/professionals', authController.authenticateJWT, professionalController.getAll)
router.post('/professionals', authController.authenticateJWT, professionalController.addNew)
router.put('/professionals/:id', authController.authenticateJWT, professionalController.update)
router.delete('/professionals/:id', authController.authenticateJWT, professionalController.delete)

router.get('/patients', authController.authenticateJWT, patientController.getAll)
router.post('/patients', authController.authenticateJWT, patientController.addNew)
router.put('/patients/:id', authController.authenticateJWT, patientController.update)
router.delete('/patients/:id', authController.authenticateJWT, patientController.delete)

router.get('/categories', authController.authenticateJWT, categoryController.getAll)
router.post('/categories', authController.authenticateJWT, categoryController.addNew)
router.put('/categories/:id', authController.authenticateJWT, categoryController.update)
router.delete('/categories/:id', authController.authenticateJWT, categoryController.delete)

router.get('/licenses', authController.authenticateJWT, licenseController.getAll)
router.post('/licenses', authController.authenticateJWT, licenseController.addNew)
router.put('/licenses/:id', authController.authenticateJWT, licenseController.update)
router.delete('/licenses/:id', authController.authenticateJWT, licenseController.delete)

// Update a User with id
// router.put('/:id', authController.update);

// Delete a User with id
// router.delete('/:id', authController.delete);


module.exports = router;