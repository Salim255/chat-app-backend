const chatModel = require('../models/chatModel')

exports.createChat = async (req, res) => {
  const chat = await chatModel.insert()

  res.status(200)
    .json({
      status: 'success',
      data: chat
    })
}

exports.counter = () => {
  return chatModel.counter()
}
