const pool = require('../config/pool')

class Message {
  static async insert ({ content, fromUserId, toUserId, chatId, partnerConnectionStatus }) {
    const partnerStatus = partnerConnectionStatus === 'online' ? 'delivered' : 'sent';

    const { rows } = await pool.query(`
        INSERT INTO messages (content, from_user_id, to_user_id , chat_id, status)
        VALUES
            ($1, $2, $3, $4, $5) RETURNING *;
        `, [content, fromUserId, toUserId, chatId, partnerStatus])
    return rows[0]
  }

  static async count () {
    const { rows } = await pool.query(`
    SELECT COUNT(*) FROM messages ;
    `)

    return rows[0].count
  }

  static async updateSingleMessageStatus ({ messageId, messageStatus, userId }) {
    const { rows } = await pool.query(`
    UPDATE messages
      SET status = $1
        WHERE id = $2 AND from_user_id = $3
        RETURNING *;
    `, [messageStatus, messageId, userId]);

    return rows[0]
  }

  static async updateChatMessagesStatusToDelivered ({ chatId, userId }) {
    const { rows } = await pool.query(`
    UPDATE messages
      SET status = 'delivered'
        WHERE chat_id = $1 AND status = 'sent' AND from_user_id != $2
        RETURNING *;
    `, [chatId, userId])
    return rows[0]
  }

  static async updateChatMessagesStatusToRead (data) {
    const { rows } = await pool.query(`
    UPDATE messages
      SET status = 'read'
        WHERE chat_id = $1 AND status = 'delivered' AND from_user_id != $2
        RETURNING *;
    `, [data.chatId, data.userId])
    return rows[0]
  }

  static async updateMessagesToDeliveredByUser (userId) {
    console.log(userId, 'Hello 🏜️🏜️🏜️');

    const { rows } = await pool.query(`
      UPDATE messages
        SET status = 'delivered'
          WHERE status = 'sent' AND to_user_id = $1
          RETURNING *;
      `, [userId])
    return rows
  }

  // This code used to update messages in room to read once receiver joined a room
  static async updateMessagesToReadByReceiver (fromUserId, toUserId) {
    console.log(typeof fromUserId, toUserId)

    const fromUser = toUserId;
    const toUser = fromUserId;
    const { rows } = await pool.query(`
      UPDATE messages
      SET status = 'read'
      WHERE status = 'delivered' AND to_user_id = $1 AND from_user_id = $2
          RETURNING *;
      `, [toUser, fromUser])
    console.log(rows[0])
    return rows
  }
}

module.exports = Message
