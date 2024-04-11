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
  console.log(req.userId);
  const result = await chatModel.getChatsByUser(req.userId)

  res.status(200).json({
    status: 'success',
    data: result
  })
}
exports.counter = () => {
  return chatModel.counter()
}
