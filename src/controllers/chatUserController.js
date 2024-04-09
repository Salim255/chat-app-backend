const chatUserModel = require('../models/chatUserModel')

exports.counter = async (req, res, next) => {
  return await chatUserModel.count()
}

exports.createChatUser = async (req, res, next) => {
  const { usersIdsList, chatId } = req.body

  let result
  for (userId of usersIdsList) {
    result = await chatUserModel.insert({ userId, chatId })
  }

  res.status(200).json({
    status: 'success',
    data: result

  })
}
