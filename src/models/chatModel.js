const pool = require('../config/pool')

class Chat {
  static async getChats (userId) {
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

  static async getChatsByUser (userId) {
    const { rows } = await pool.query(`
    SELECT chats.id, chats.type, chats.created_at, chats.updated_at,

    (SELECT jsonb_agg(users) FROM (
      SELECT u.id AS user_id, u.avatar, u.last_name , u.first_name FROM users u
        WHERE u.id IN (
          SELECT uc.user_id FROM userChats uc
            WHERE uc.chat_id = cu.chat_id)
            ) AS users
        ) AS users
    ,

    (SELECT jsonb_agg(messages) FROM (
      SELECT * FROM messages
        WHERE chat_id IN (
          SELECT ms.chat_id FROM messages ms
            WHERE ms.chat_id = cu.chat_id )
            )AS messages
    ) AS messages

    FROM userChats cu
    JOIN chats ON cu.chat_id = chats.id
      WHERE cu.user_id = $1
    `, [userId])
    return rows
  }

  static async getChatByChatId (data) {
    const { rows } = await pool.query(`
    SELECT chats.id, chats.type, chats.created_at, chats.updated_at,
    (SELECT jsonb_agg(users) FROM (
      SELECT * FROM users
        WHERE id IN (
          SELECT uc.user_id FROM userChats uc
            WHERE uc.chat_id = cu.chat_id)
            ) AS users
        ) AS users
    ,

    (SELECT jsonb_agg(messages) FROM (
      SELECT * FROM messages
        WHERE chat_id IN (
          SELECT ms.chat_id FROM messages ms
            WHERE ms.chat_id = cu.chat_id )
            )AS messages
    ) AS messages

    FROM userChats cu
    JOIN chats ON cu.chat_id = chats.id
      WHERE cu.user_id = $1 AND chats.id = $2
    `, [data.userId, data.chatId])

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
