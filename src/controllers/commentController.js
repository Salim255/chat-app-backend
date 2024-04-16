const commentModal = require('../models/commentModel')
const catchAsync = require('../utils/catchAsync')

exports.counter = catchAsync(async (req, res, next) => {
  return await commentModal.count()
})

exports.createComment = catchAsync(async (req, res, next) => {
  const { content, userId, postId } = req.body
  const result = await commentModal.insert({ content, userId, postId })

  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.updateComment = catchAsync(async (req, res, next) => {
  const { content } = req.body
  const { commentId } = req.params
  const result = await commentModal.updateComment({ content, commentId })

  res.status(200).json({
    status: 'success',
    data: result
  })
})
