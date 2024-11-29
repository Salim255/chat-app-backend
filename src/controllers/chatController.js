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
  const result = await chatModel.getChatsByUser(req.userId)
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.getChatByUsersIds = catchAsync(async (req, res, next) => {
  const { partnerId } = req.params
  const data = { userId1: req.userId, userId2: partnerId * 1 }

  const result = await chatModel.getChatByUsersIds(data)
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.getChatByChatId = catchAsync(async (req, res, next) => {
  const { chatId } = req.params
  const userId = req.userId
  const result = await chatModel.getChatByChatId({ chatId, userId })
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.counter = catchAsync(async (req, res, next) => {
  return await chatModel.counter()
})
