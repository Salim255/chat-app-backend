const pool = require('../config/pool')

class Message {
  static async insert (data) {
    const { rows } = await pool.query(`
        INSERT INTO messages (content, from_user_id, chat_id)
        VALUES
            ($1, $2, $3) RETURNING *;
        `, [data.content, data.userId, data.chatId])
    return rows[0]
  }

  static async count () {
    const { rows } = await pool.query(`
    SELECT COUNT(*) FROM messages ;
    `)

    return rows[0].count
  }

  static async updateChatMessagesStatusToDelivered (data) {
    const { rows } = await pool.query(`
    UPDATE messages
      SET status = 'delivered'
        WHERE chat_id = $1 AND status = 'sent' AND from_user_id != $2
        RETURNING *;
    `, [data.chatId, data.userId])
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
}

module.exports = Message
