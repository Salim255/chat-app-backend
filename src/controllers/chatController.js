const chatModel = require('../models/chatModel');
const chatUserModel = require('../models/chatUserModel');
const messageModel = require('../models/messageModel');
const userModel = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const pool = require('../config/pool');

// ====== Start Create a new chat
exports.createChat = catchAsync(async (req, res, next) => {
  // ====== Start transaction =====
  await pool.query('BEGIN'); // Start Transaction
  // ==============================
  try {
    const { content, toUserId, fromUserId } = req.body;

    // ====== Validate user IDs =====
    if (!toUserId || !fromUserId) {
      return next(new AppError('Both users need to be provided', 400));
    }
    // ==== End checking ids =========

    // ===== Check if the two users are  already chatting
    const existingChat = await chatModel.getChatByUsersIds({ toUserId, fromUserId });
    if (existingChat) {
      return next(new AppError('Users already in chat connection', 400))
    }
    // ======== End checking ===========

    // ====== Create chat ========
    // Set A save point
    // await client.query('SAVEPOINT before_insert');
    const { id: chatId } = await chatModel.insert();
    // ====== End Create chat =====

    // ===== Prepare the statement =========
    // Prepare the values for inserting chat users
    const userIds = [
      { userId: fromUserId, isAdmin: true }, // Admin
      { userId: toUserId, isAdmin: false } // Regular user
    ];
    const userValues = [];
    const placeHolders = userIds.map(({ userId, isAdmin }, index) => {
      // Fill the statement array
      userValues.push(userId, chatId, isAdmin);
      return `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
    }).join(', ');
    // ==== End statement preparation =====

    // ======Create chatUsers, using the statement ========
    await chatUserModel.insertMany({ userValues, placeHolders });
    // ====== End chatUsers creation

    // ======== Get partner connection status ====
    const partner = await userModel.getUserById(toUserId);
    const partnerConnectionStatus = partner ? partner.connection_status : null;
    // ===== End Getter =========

    // ===== Start Create first message
    const { id: messageId } = await messageModel.insert(
      {
        content,
        fromUserId,
        toUserId,
        chatId,
        partnerConnectionStatus
      });

    // ===== End create message
    // ===== Start Update chat's last_message_id===
    const updatedChat = await chatModel.updateChatLastMessageIdField({ chatId, messageId });
    // ====== End Update chat last_message

    // ======= Fetch created chat ======
    const chat = await chatModel.getChatByChatId({ userId: fromUserId, chatId });
    // ======== End fetching created chat ========

    // ===== Start set chat last message Id
    // ===== Confirm create chat mission =====
    await pool.query('COMMIT');// Commit if Successful
    // ========================= End ====

    console.log(chat, 'message 💥💥💥', chatId, updatedChat);
    // ====== Send response to the client
    res.status(200).json({
      status: 'success',
      data: chat[0]
    });
    // ====== End with success ===========
  } catch (error) {
    console.log(error)
    await pool.query('ROLLBACK');
    return next(new AppError(error, 500));
  }
})
// ========== END Creation new chat section =====

// Fetch all chats for the logged-in user
exports.getChats = catchAsync(async (req, res, next) => {
  const chats = await chatModel.getChats(req.userId)

  res.status(200).json({
    status: 'success',
    data: chats
  })
})

// Fetch chat by specific user
exports.getChatsByUser = catchAsync(async (req, res, next) => {
  const chats = await chatModel.getChatsByUser(req.userId)
  res.status(200).json({
    status: 'success',
    data: chats
  })
})

exports.getChatByUsersIds = catchAsync(async (req, res, next) => {
  const { partnerId } = req.params
  const data = { userId1: req.userId, userId2: partnerId * 1 }

  const chat = await chatModel.getChatByUsersIds(data)
  res.status(200).json({
    status: 'success',
    data: chat
  })
})

// Fetch chat by chatID
exports.getChatByChatId = catchAsync(async (req, res, next) => {
  const { chatId } = req.params
  const userId = req.userId
  const chat = await chatModel.getChatByChatId({ chatId, userId })
  res.status(200).json({
    status: 'success',
    data: chat
  })
})

exports.counter = catchAsync(async (req, res, next) => {
  return await chatModel.counter()
})
