const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const messageModel = require('../models/messageModel');
const chatModel = require('../models/chatModel');
const pool = require('../config/pool');

exports.counter = catchAsync(async (req, res, next) => {
  return await messageModel.count()
})

exports.sendMessage = catchAsync(async (req, res, next) => {
  // ==== Start transaction
  await pool.query('BEGIN');
  // =======================

  try {
    const { content, toUserId, chatId } = req.body;
    let partnerConnectionStatus;

    // Check for validate information
    if (!toUserId || !content || !chatId) {
      return next(new AppError('Send message information error need to be provided', 400));
    }

    const { id: messageId } = await messageModel.insert({ content, fromUserId: req.userId, toUserId, chatId, partnerConnectionStatus });

    // === Update chat last message
    if (messageId) {
      await chatModel.updateChatLastMessageIdField({ chatId, messageId })
    }
    // ==== END updated last message

    // ==== Start Fetching chat =====
    const chat = await chatModel.getChatByChatId({ userId: req.userId, chatId });
    // ===== End Fetching chat =======

    // Confirm and End transaction
    await pool.query('COMMIT');
    // ======================= //

    // ==== Send response =====
    res.status(200).json({
      status: 'success',
      data: chat
    })
  } catch (error) {
    await pool.query('ROLLBACK');
    return next(new AppError(error, 500));
  }
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
