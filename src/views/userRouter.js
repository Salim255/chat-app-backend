const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const upload = require('../middlewares/media/multerMiddleware');

router.post('/signup/createUser', authController.createUser)
router.post('/signup/createAdmin', authController.createAdmin)
router.post('/login', authController.login)
router.get('/', authController.protect, userController.getUserByID)
router.patch('/updateMe', upload.single('photo'), authController.updateMe)
router.put('/:userId/disable', authController.protect, userController.disableUser)

module.exports = router
