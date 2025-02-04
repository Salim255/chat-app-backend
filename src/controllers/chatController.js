const chatModel = require('../models/chatModel');
const catchAsync = require('../utils/catchAsync')
const pool = require('../config/pool');
exports.createChat = catchAsync(async (req, res, next) => {
  const { toUserId, fromUserId } = req.body;
  await pool.query('BEGIN');
  if (!toUserId || !fromUserId) {
    return next(
      new AppError('Chat need to have two users', 400)
    )
  }

  // Check if the two users are  already chatting
  const result = await chatModel.getChatByUsersIds({ toUserId, fromUserId });
  if (result) {
    return next(
      new AppError('Users already in chat connection', 400)
    )
  }

  // Create chat
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
