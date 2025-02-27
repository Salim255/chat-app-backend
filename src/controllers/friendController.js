const friendModel = require('../models/friendModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.counter = catchAsync(async (req, res, next) => {
  const result = await friendModel.count()
  return result
})

exports.addFriend = catchAsync(async (req, res, next) => {
  const { friend_id: friendId } = req.body
  const { userId } = req;

  if (!friendId || !userId) {
    return next(new AppError('Invalid partner id', 400))
  }

  // Check if there are already a friend request between the two users
  const existingFriendRequest = await friendModel.getFriendShip({ userId, friendId })
  if (existingFriendRequest?.id) {
    // Update the status of the friend request to "2" as (accepted)
    const result = await friendModel.acceptFriendShip({ friendshipId: existingFriendRequest.id, userId });
    console.log(result, 'result acceoted');
    return res.status(200).json({
      status: 'success',
      data: result
    })
  }

  // Insert a new friend request
  const result = await friendModel.insert({ friendId, userId });

  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.getFriends = catchAsync(async (req, res, next) => {
  const result = await friendModel.getFriends(req.userId)
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.getNonFriends = catchAsync(async (req, res, next) => {
  const result = await friendModel.getNonFriends(req.userId);
  console.log(result, 'result');
  res.status(200).json({
    status: 'success',
    data: result
  })
})
