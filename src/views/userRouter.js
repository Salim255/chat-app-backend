const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

router.post('/signup/createUser', authController.createUser)
router.post('/signup/createAdmin', authController.createAdmin)
router.post('/login', authController.login)
router.get('/', authController.protect, userController.getUserByID)
router.put('/:userId/disable', authController.protect, userController.disableUser)

module.exports = router
