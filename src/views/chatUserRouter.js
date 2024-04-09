const express = require('express')
const router = express.Router()
const chatUserController = require('../controllers/chatUserController')
const authController = require('../controllers/authController')

router.post('/', authController.protect, chatUserController.createChatUser)

module.exports = router
