const userModel = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

exports.counter = catchAsync(async (req, res, next) => {
  const result = await userModel.counter()
  return result
})

exports.getUserByID = catchAsync(async (req, res, next) => {
  const userId = req.userId
  const { password, ...rest } = await userModel.getUserById(userId)
  res.status(200).json({
    status: 'success',
    data: rest
  })
})
