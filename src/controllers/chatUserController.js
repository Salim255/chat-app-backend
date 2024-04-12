const chatUserModel = require('../models/chatUserModel')

exports.counter = async (req, res, next) => {
  return await chatUserModel.count()
}

exports.createChatUser = async (req, res, next) => {
  const { usersIdsList } = req.body

  for (userId of usersIdsList) {
    await chatUserModel.insert({ userId, chatId: req.chatId })
  }
  // Next create message
  next()
}
