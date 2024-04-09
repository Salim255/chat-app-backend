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
}

module.exports = Message
