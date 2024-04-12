const messageModel = require('../models/messageModel')

exports.counter = async () => {
  return messageModel.count()
}

exports.sendMessage = async (req, res, next) => {
  const { content } = req.body
  const result = await messageModel.insert({ content, userId: req.userId, chatId: req.chatId })
  res.status(200).json({
    status: 'success',
    data: result
  })
}
