const postModel = require('../models/postModel')
const catchAsync = require('../utils/catchAsync')

exports.counter = catchAsync(async (req, res, next) => {
  return await postModel.count()
})
exports.createPost = catchAsync(async (req, res) => {
  const { userId, message } = req.body
  const result = await postModel.insert({ userId, message })
  res.status(200).json({
    status: 'success',
    data: result
  })
})
