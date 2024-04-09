const pool = require('../config/pool')

class ChatUser {
  static async insert (data) {
    const { rows } = await pool.query(`
    INSERT INTO userChats
        (user_id, chat_id)
    VALUES
        ($1, $2) RETURNING *;
    `, [data.userId, data.chatId])
    return rows[0]
  }

  static async count () {
    const { rows } = await pool.query(`
      SELECT COUNT(*) FROM userChats;
      `)
    return rows[0].count
  }
}

module.exports = ChatUser
