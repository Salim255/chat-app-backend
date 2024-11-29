const chatUserModel = require('../models/chatUserModel')
const catchAsync = require('../utils/catchAsync')

exports.counter = catchAsync(async (req, res, next) => {
  return await chatUserModel.count()
})

exports.createChatUser = catchAsync(async (req, res, next) => {
  const { toUserId, fromUserId } = req.body;
  const partnerList = [fromUserId, toUserId];

  for (userId of partnerList) {
    await chatUserModel.insert({ userId, chatId: req.chatId })
  }
  // Next create message
  next()
})
