const chatModel = require('../models/chatModel')

exports.createChat = async (req, res) => {
  const chat = await chatModel.insert()

  res.status(200)
    .json({
      status: 'success',
      data: chat
    })
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
