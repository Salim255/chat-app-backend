const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const friendController = require('../controllers/friendController')

router.post('/', authController.protect, friendController.addFriend)
router.get('/', authController.protect, friendController.getFriends)
router.get('/non-friends', authController.protect, friendController.getNonFriends)

module.exports = router
