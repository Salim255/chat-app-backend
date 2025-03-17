const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')
const authController = require('../controllers/authController')
const messageController = require('../controllers/messageController')

router.post('/', authController.protect, chatController.createChat);
router.get('/', authController.protect, chatController.getChatsByUser);
router.get('/users/:partnerId', authController.protect, chatController.getChatByUsersIds);
router.get('/:chatId', authController.protect, chatController.getChatByChatId);
router.put('/:chatId/messages/:status', authController.protect, messageController.updateChatMessagesStatus);

module.exports = router;
