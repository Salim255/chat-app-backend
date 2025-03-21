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
    const { content, toUserId, chatId, partnerConnectionStatus } = req.body;

    // Check for validate information
    if (!toUserId || !content || !chatId) {
      return next(new AppError('Send message information error need to be provided', 400));
    }

    const messageStatus = partnerConnectionStatus === 'online' ? 'delivered' : 'sent';
    const message = await messageModel.insert({ content, fromUserId: req.userId, toUserId, chatId, messageStatus });

    // === Update chat last message field  ===
    if (message && message.id) {
      await chatModel.updateChatLastMessageIdField({ chatId, messageId: message.id })
    }
    // ==== END updated last message

    // Confirm and End transaction
    await pool.query('COMMIT');
    // ======================= //

    // ==== Send response =====
    res.status(200).json({
      status: 'success',
      data: message
    })
  } catch (error) {
    await pool.query('ROLLBACK');
    return next(new AppError(error, 500));
  }
})

exports.updateChatMessagesStatus = catchAsync(async (req, res, next) => {
  // ====== Collect required data ====
  const { chatId, status } = req.params;
  const userId = req.userId;

  // === Start check for data =====
  if (!chatId || !status) {
    return next(new AppError('Both chatId and message status are need to be provided', 400));
  }
  // ==== End Check for data =====

  // ===== Start update message status ===========
  const result = (status === 'read' ? await messageModel.updateChatMessagesStatusToRead({ chatId, userId }) : await messageModel.updateChatMessagesStatusToDelivered({ chatId, userId }));
  // ======== End of update message status =======

  // ==== Send response ======
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.updateMessagesToDeliveredByUser = catchAsync(async (req, res, next) => {
  // ====== Collect required data ====
  const userId = req.userId;
  // ======End data collection ====

  // === Start check for data =====
  if (!userId) {
    return next(new AppError('User id need to be provided', 400));
  }
  // ==== End Check for data =====

  // =====Start  Update message ======
  const result = (userId && await messageModel.updateMessagesToDeliveredByUser(userId));
  // ======= End update message =======

  // ==== Send response ========
  res.status(200).json({
    status: 'success',
    data: result
  })
})

exports.updateMessageStatus = catchAsync(async (messageId, messageStatus, fromUserId) => {
  // === Start check for data =====
  if (!messageId || !messageStatus || !fromUserId) {
    return;
  }
  // ==== End Check for data =====

  //  === Starting update =======
  const result = await messageModel.updateSingleMessageStatus({ messageId, messageStatus, userId: fromUserId });
  // ====== End of update message =====
  console.log(result, 'hello🥵🥰🥰🥰')
  // === Send back result ======
  return result;
});

exports.updateMessagesStatusWithJoinRoom = catchAsync(async (fromUserId, toUserId) => {
  if (!fromUserId || !toUserId) {
    return;
  }
  const result = await messageModel.updateMessagesToReadByReceiver(fromUserId, toUserId);
  return result;
  //
})
