const messageModel = require('../models/messageModel')
const chatModel = require('../models/chatModel')
const catchAsync = require('../utils/catchAsync')

exports.counter = catchAsync(async (req, res, next) => {
  return await messageModel.count()
})

exports.firstMessage = catchAsync(async (req, res, next) => {
  const { content } = req.body
  await messageModel.insert({ content, userId: req.userId, chatId: req.chatId })

  const chat = await chatModel.getChatByChatId({ userId: req.userId, chatId: req.chatId })

  res.status(200).json({
    status: 'success',
    data: chat
  })
})

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { content, userId, chatId } = req.body
  await messageModel.insert({ content, userId: req.userId, chatId })

  const chat = await chatModel.getChatByChatId({ userId, chatId })

  res.status(200).json({
    status: 'success',
    data: chat
  })
})
