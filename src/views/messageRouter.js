const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const messageController = require('../controllers/messageController')

router.post('/', authController.protect, messageController.sendMessage);
router.put('/user', authController.protect, messageController.updateMessagesToDeliveredByUser)

module.exports = router
