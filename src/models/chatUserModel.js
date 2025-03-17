const pool = require('../config/pool')

class ChatUser {
  static async insert ({ userId, chatId }) {
    const { rows } = await pool.query(`
    INSERT INTO user_chats
        (user_id, chat_id)
    VALUES
        ($1, $2) RETURNING *;
    `, [userId, chatId])
    return rows[0]
  }

  static async insertMany ({ userValues, placeHolders }) {
    const { rows } = await pool.query(`
      INSERT INTO user_chats
          (user_id, chat_id, is_admin)
      VALUES
          ${placeHolders} RETURNING *;
      `, userValues)
    return rows
  }

  static async count () {
    const { rows } = await pool.query(`
      SELECT COUNT(*) FROM user_chats;
      `)
    return rows[0].count
  }
}

module.exports = ChatUser
