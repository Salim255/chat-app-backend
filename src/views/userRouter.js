const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const multerMiddleWare = require('../middlewares/media/multerMiddleware');

const uploadUserPhotoToS3Bucket = require('../middlewares/cloudStorage/aws-s3');

router.post('/signup/createUser', authController.createUser)
router.post('/signup/createAdmin', authController.createAdmin)
router.post('/login', authController.login)
router.get('/', authController.protect, userController.getUserByID)
router.patch('/updateMe', multerMiddleWare.uploadUserPhoto, multerMiddleWare.resizeUserPhoto, uploadUserPhotoToS3Bucket.uploadToS3Bucket, authController.updateMe)
router.put('/:userId/disable', authController.protect, userController.disableUser)

// authController.updateMe
module.exports = router
