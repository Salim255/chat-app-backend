const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')
const authController = require('../controllers/authController')

router.post('/', authController.protect, chatController.createChat)
router.get('/', authController.protect, chatController.getChats)
router.get('/:userId', authController.protect, chatController.getChatsByUser)

module.exports = router
