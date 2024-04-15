const chatModel = require('../models/chatModel')
const catchAsync = require('../utils/catchAsync')

exports.createChat = catchAsync(async (req, res, next) => {
  const { id: chatId } = await chatModel.insert()
  req.chatId = chatId

  // Next to create userChar
  next()
})

exports.getChats = catchAsync(async (req, res, next) => {
  const result = await chatModel.getChats(req.userId)

  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.getChatsByUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params
  const result = await chatModel.getChatsByUser(userId)
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.counter = catchAsync(async (req, res, next) => {
  return await chatModel.counter()
})
