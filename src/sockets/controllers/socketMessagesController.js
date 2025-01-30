const catchAsync = require('../../utils/catchAsync');

const messageModel = require('../../models/messageModel');

exports.updateMessageStatus = catchAsync(async (messageId, messageStatus, fromUserId) => {
  const result = await messageModel.updateSingleMessageStatus({ messageId, messageStatus, userId: fromUserId });
  return result;
})
