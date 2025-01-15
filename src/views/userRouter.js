const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const multerMiddleWare = require('../middlewares/media/multerMiddleware');
const cloudinaryMiddleWare = require('../middlewares/cloudStorage/cloudinaryMiddleware');

router.post('/signup/createUser', authController.createUser)
router.post('/signup/createAdmin', authController.createAdmin)
router.post('/login', authController.login)
router.get('/', authController.protect, userController.getUserByID)
router.patch('/updateMe', multerMiddleWare.uploadUserPhoto, multerMiddleWare.resizeUserPhoto, cloudinaryMiddleWare.uploadImage)
router.put('/:userId/disable', authController.protect, userController.disableUser)

// authController.updateMe
module.exports = router
