const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')
const authController = require('../controllers/authController')
const chatUserController = require('../controllers/chatUserController')
const messageController = require('../controllers/messageController')

router.post('/', authController.protect, chatController.createChat, chatUserController.createChatUser, messageController.firstMessage)
router.get('/', authController.protect, chatController.getChatsByUser)
router.get('/:chatId', authController.protect, chatController.getChatByChatId)
router.get('/chat-by-users-ids/:partnerId', authController.protect, chatController.getChatByUsersIds)
router.put('/:chatId/messages/:status', authController.protect, messageController.updateChatMessagesStatus)

module.exports = router
