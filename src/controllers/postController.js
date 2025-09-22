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

exports.updatePostById = catchAsync(async (req, res, next) => {
  const { postId } = req.params
  const { message } = req.body

  const result = await postModel.updatePost({ postId, message })
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.deletePostById = catchAsync(async (req, res, next) => {
  const { postId } = req.params
  const result = await postModel.deletePost(postId)

  res.status(204).json({
    status: 'success',
    data: result
  })
})
