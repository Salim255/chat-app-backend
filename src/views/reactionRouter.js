const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const reactionController = require('../controllers/reactionController')

router.post('/posts', authController.protect, reactionController.createPostReaction)
router.delete('/posts/:postId', authController.protect, reactionController.deletePostReaction)

module.exports = router
