const userModel = require('../models/userModel')
const AppError = require('../utils/appError')
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

exports.disableUser = catchAsync(async (req, res, next) => {
  const userId = req.userId
  const { userId: userToDisableId } = req.params
  const user = await userModel.getUserById(userId)

  if (!user.is_staff || !user.is_active) {
    console.log(userToDisableId);
    return next(new AppError('Action not authorized', 401))
  }

  const { password, ...rest } = await userModel.disableUser(userToDisableId)

  res.status(200).json({
    status: 'success',
    data: rest
  })
})
