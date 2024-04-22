const friendModel = require('../models/friendModel')
const catchAsync = require('../utils/catchAsync')

exports.counter = catchAsync(async (req, res, next) => {
  const result = await friendModel.count()
  return result
})

exports.addFriend = catchAsync(async (req, res, next) => {
  const { friend_id: friendId } = req.body
  const userId = req.userId
  const result = await friendModel.insert({ friendId, userId })
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.getFriends = catchAsync(async (req, res, next) => {
  return 1
})

exports.getNonFriends = catchAsync(async (req, res, next) => {
  return 1
})
