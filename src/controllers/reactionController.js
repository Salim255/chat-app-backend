const reactionModel = require('../models/reactionModel')

exports.counter = async (req, res, next) => {
  return await reactionModel.count()
}

exports.createPostReaction = async (req, res, next) => {
  const { postId, userId } = req.body
  const result = await reactionModel.insert({ postId, type: 'post', userId })

  res.status(200).json({
    status: 'success',
    data: result
  })
}

exports.deletePostReaction = async (req, res, next) => {
  const { postId } = req.params

  const result = await reactionModel.deletePostReaction({ userId: req.userId, postId })
  res.status(200).json({
    status: 'success',
    data: result
  })
}
