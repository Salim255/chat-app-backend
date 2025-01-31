const catchAsync = require('../../utils/catchAsync');

const messageModel = require('../../models/messageModel');

exports.updateMessageStatus = catchAsync(async (messageId, messageStatus, fromUserId) => {
  const result = await messageModel.updateSingleMessageStatus({ messageId, messageStatus, userId: fromUserId });
  return result;
})

exports.updateMessagesStatusWithJoinRoom = catchAsync(async (fromUserId, toUserId) => {
  const result = await messageModel.updateMessagesToReadByReceiver(fromUserId, toUserId);
  return result;
})
