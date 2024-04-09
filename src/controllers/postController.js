const postModel = require('../models/postModel')

exports.counter = async () => {
  return await postModel.count()
}
exports.createPost = async (req, res) => {
  const { userId, message } = req.body
  const result = await postModel.insert({ userId, message })
  res.status(200).json({
    status: 'success',
    data: result
  })
}
