const messageModel = require('../models/messageModel');
const chatModel = require('../models/chatModel');
const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const pool = require('../config/pool');

exports.counter = catchAsync(async (req, res, next) => {
  return await messageModel.count()
})

exports.firstMessage = catchAsync(async (req, res, next) => {
  const { content, toUserId, fromUserId } = req.body;

  // Check partner connection status
  const partner = await userModel.getUserById(toUserId);
  let partnerConnectionStatus;
  console.log(partner)
  if (partner) {
    partnerConnectionStatus = partner.connection_status;
  }

  await messageModel.insert({ content, fromUserId, toUserId, chatId: req.chatId, partnerConnectionStatus })

  const chat = await chatModel.getChatByChatId({ userId: fromUserId, chatId: req.chatId });
  await pool.query('COMMIT');
  res.status(200).json({
    status: 'success',
    data: chat[0]
  })
})

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { content, toUserId, chatId } = req.body;
  let partnerConnectionStatus;

  await messageModel.insert({ content, fromUserId: req.userId, toUserId, chatId, partnerConnectionStatus })

  const chat = await chatModel.getChatByChatId({ userId: req.userId, chatId })

  res.status(200).json({
    status: 'success',
    data: chat
  })
})

exports.updateChatMessagesStatus = catchAsync(async (req, res, next) => {
  const { chatId, status } = req.params;
  const userId = req.userId;
  const result = (status === 'read' ? await messageModel.updateChatMessagesStatusToRead({ chatId, userId }) : await messageModel.updateChatMessagesStatusToDelivered({ chatId, userId }))

  console.log(result, 'Hello result', chatId, status, userId);
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.updateMessagesToDeliveredByUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  const result = (userId && await messageModel.updateMessagesToDeliveredByUser(userId));

  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.updateMessageStatus = catchAsync(async (messageId, messageStatus, fromUserId) => {
  const result = await messageModel.updateSingleMessageStatus({ messageId, messageStatus, userId: fromUserId });
  return result;
})

exports.updateMessagesStatusWithJoinRoom = catchAsync(async (fromUserId, toUserId) => {
  const result = await messageModel.updateMessagesToReadByReceiver(fromUserId, toUserId);
  return result;
  //
})
