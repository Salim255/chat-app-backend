const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')
const authController = require('../controllers/authController')
const chatUserController = require('../controllers/chatUserController')
const messageController = require('../controllers/messageController')

router.post('/', authController.protect, chatController.createChat, chatUserController.createChatUser, messageController.sendMessage)
router.get('/', authController.protect, chatController.getChats)
router.get('/:userId', authController.protect, chatController.getChatsByUser)

module.exports = router
