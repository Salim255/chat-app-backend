const pool = require('../config/pool')

class Chat {
  static async getChatsByUser (userId) {
    const { rows } = await pool.query(`
    SELECT *,

    (SELECT jsonb_agg(messages)
       FROM (SELECT * FROM messages ms
          WHERE ms.chat_id = c.id
          ) AS messages
    ) AS messages,

    (SELECT jsonb_agg(users)
    FROM (
      SELECT * FROM users
        WHERE id IN (
          SELECT uc.user_id FROM userChats uc
            WHERE uc.chat_id = c.id)
            ) AS users
          ) AS users
    FROM chats c ;
      `)

    return rows
  }

  static async counter () {
    const { rows } = await pool.query(`
    SELECT COUNT(*) FROM chats ;
    `)

    return rows[0].count
  }

  static async insert () {
    const { rows } = await pool.query(`
    INSERT INTO chats
        (id)
    VALUES
        (DEFAULT)
    RETURNING * ;
    `)

    return rows[0]
  }
}

module.exports = Chat
