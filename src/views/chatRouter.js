const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')
const authController = require('../controllers/authController')

router.post('/', authController.protect, chatController.createChat)

module.exports = router
