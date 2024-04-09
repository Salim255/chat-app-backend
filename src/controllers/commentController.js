const commentModal = require('../models/commentModel')

exports.counter = async () => {
  return commentModal.count()
}

exports.createComment = async (req, res, next) => {
  const { content, userId, postId } = req.body
  const result = await commentModal.insert({ content, userId, postId })

  res.status(200).json({
    status: 'success',
    data: result
  })
}
