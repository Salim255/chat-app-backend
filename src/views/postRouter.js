const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const postController = require('../controllers/postController')

router.post('/', authController.protect, postController.createPost)

module.exports = router
