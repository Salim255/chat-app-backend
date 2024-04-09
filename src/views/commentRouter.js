const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const commentController = require('../controllers/commentController')

router.post('/', authController.protect, commentController.createComment)

module.exports = router
