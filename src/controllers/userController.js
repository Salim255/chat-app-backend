const userModel = require('../models/userModel')

exports.counter = async () => {
  const result = await userModel.counter()
  return result
}

exports.getUserByID = async (req, res, next) => {
  const userId = req.userId
  const { password, ...rest } = await userModel.getUserById(userId)
  res.status(200).json({
    status: 'success',
    data: rest
  })
}
