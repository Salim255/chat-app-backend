const pool = require('../config/pool')

class Message {
  static async insert ({ content, fromUserId, toUserId, chatId, messageStatus }) {
    const { rows } = await pool.query(`
        INSERT INTO messages (content, from_user_id, to_user_id , chat_id, status)
        VALUES
            ($1, $2, $3, $4, $5) RETURNING *;
        `, [content, fromUserId, toUserId, chatId, messageStatus])
    return rows[0]
  }

  static async count () {
    const { rows } = await pool.query(`
    SELECT COUNT(*) FROM messages ;
    `)

    return rows[0].count
  }

  static async updateSingleMessageStatus ({ messageId, messageStatus, userId }) {
    /* const { rows } = await pool.query(`
    UPDATE messages
      SET status = $1
        WHERE id = $2 AND from_user_id = $3
        RETURNING *;
    `, [messageStatus, messageId, userId]); */
    const { rows } = await pool.query(`
      WITH updated_message AS (
        UPDATE messages
        SET status = $1
        WHERE id = $2
        RETURNING *
      )

      SELECT
        um.*,

        --- Here we are selecting the encrypted session key based receiver ---
        --- As he receive the message from socket ---
        CASE
          WHEN sk.sender_id = $3 THEN sk.encrypted_session_for_receiver
          ELSE sk.encrypted_session_for_sender
        END AS encrypted_session_base64

      FROM updated_message um

      LEFT JOIN session_keys sk ON sk.chat_id = um.chat_id;
    `, [messageStatus, messageId, userId]);
    return rows[0]
  }

  /*   const { rows } = await pool.query(`
    WITH updated_message AS (
      UPDATE messages
      SET status = $1
      WHERE id = $2 AND from_user_id = $3
      RETURNING *
    )
    SELECT
      um.*,
      CASE
        WHEN sk.sender_id = $3 THEN sk.encrypted_session_for_sender
        ELSE sk.encrypted_session_for_receiver
      END AS encrypted_session_base64
    FROM updated_message um
    LEFT JOIN session_keys sk ON um.chat_id = sk.chat_id;
  `, [messageStatus, messageId, userId]); */
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
      WHERE (status = 'delivered' OR  status = 'sent')  AND to_user_id = $1 AND from_user_id = $2
          RETURNING *;
      `, [toUser, fromUser])
    return rows
  }

  // Here we update messages that were sent to this userId to 'delivered' once they are connected
  static async updateAllMessageStatusToDelivered (userId) {
    console.log(userId, 'Hello')
    const { rows } = await pool.query(`
        UPDATE messages msg
        SET status = 'delivered'
        WHERE msg.to_user_id = $1
        RETURNING *
      `, [userId]);
    return rows
  }
}
module.exports = Message
