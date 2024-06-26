const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const commentController = require('../controllers/commentController')

router.post('/', authController.protect, commentController.createComment)
router.put('/:commentId', authController.protect, commentController.updateComment)
router.delete('/:commentId', authController.protect, commentController.deleteComment)

module.exports = router
