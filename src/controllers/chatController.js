const chatModel = require('../models/chatModel')

exports.createChat = async (req, res, next) => {
  const { id: chatId } = await chatModel.insert()
  req.chatId = chatId

  // Next to create userChar
  next()
}

exports.getChats = async (req, res, next) => {
  const result = await chatModel.getChats(req.userId)

  res.status(200).json({
    status: 'success',
    data: result
  })
}

exports.getChatsByUser = async (req, res, next) => {
  const { userId } = req.params
  const result = await chatModel.getChatsByUser(userId)
  res.status(200).json({
    status: 'success',
    data: result
  })
}
exports.counter = () => {
  return chatModel.counter()
}
