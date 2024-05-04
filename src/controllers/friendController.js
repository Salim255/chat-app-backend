const friendModel = require('../models/friendModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.counter = catchAsync(async (req, res, next) => {
  const result = await friendModel.count()
  return result
})

exports.addFriend = catchAsync(async (req, res, next) => {
  const { friend_id: friendId } = req.body
  if (!friendId) {
    return next(new AppError('Invalid partner', 400))
  }
  const userId = req.userId
  const result = await friendModel.insert({ friend_id: friendId, userId })
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.getFriends = catchAsync(async (req, res, next) => {
  const result = await friendModel.getFriends(req.userId)
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.getNonFriends = catchAsync(async (req, res, next) => {
  const result = await friendModel.getNonFriends(req.userId)
  res.status(200).json({
    status: 'success',
    data: result
  })
})
