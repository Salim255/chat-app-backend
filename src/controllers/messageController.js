const messageModel = require('../models/messageModel')
const catchAsync = require('../utils/catchAsync')

exports.counter = catchAsync(async (req, res, next) => {
  return await messageModel.count()
})

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { content } = req.body
  const result = await messageModel.insert({ content, userId: req.userId, chatId: req.chatId })
  res.status(200).json({
    status: 'success',
    data: result
  })
})
