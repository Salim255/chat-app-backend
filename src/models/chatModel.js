const pool = require('../config/pool')

class Chat {
  static async getChatsByUser (userId) {
    const { rows } = await pool.query(`
    SELECT 
      chats.id, 
      chats.type, 
      chats.created_at, 
      chats.updated_at,
      chats.no_read_messages,

     -- Get the last message (should return a single row)
    (SELECT row_to_json(msg)
       FROM (
        SELECT  
          id, 
          created_at, 
          content, 
          from_user_id, 
          status, 
          chat_id
        FROM messages WHERE id = chats.last_message_id
      ) AS msg 
    ) AS last_message,

    (SELECT jsonb_agg(users) FROM (
      SELECT u.id AS user_id, u.avatar, u.last_name , u.first_name, u.connection_status FROM users u
        WHERE u.id IN (
          SELECT uc.user_id FROM userChats uc
            WHERE uc.chat_id = cu.chat_id)
            ) AS users
        ) AS users,

     (SELECT jsonb_agg(messages) FROM (
    SELECT * FROM messages
    WHERE chat_id = cu.chat_id
    ORDER BY created_at ASC
  ) AS messages) AS messages

    FROM userChats cu
    JOIN chats ON cu.chat_id = chats.id
      WHERE cu.user_id = $1
    `, [userId])
    return rows
  }

  // === Start =====
  static async getChatByChatId (data) {
    const { rows } = await pool.query(`
    SELECT
      chats.id,
      chats.type,
      no_read_messages, 
      chats.created_at,
      chats.updated_at,
      chats.last_message_id,
      chats.no_read_messages,

    ------ Get users in the chat ------
    (SELECT jsonb_agg(users)
     FROM (
      SELECT id, first_name, last_name, avatar, connection_status FROM users
        WHERE id IN (
          SELECT uc.user_id FROM userChats uc
            WHERE uc.chat_id = cu.chat_id)
            ) AS users
        ) AS users,
 
    -- Get the last message (should return a single row)
    (SELECT row_to_json(msg)
       FROM (
        SELECT  
          id, 
          created_at, 
          content, 
          from_user_id, 
          status, 
          chat_id
        FROM messages WHERE id = chats.last_message_id
      ) AS msg 
    ) AS last_message,
   
    -- Get all messages in the chat
    (SELECT jsonb_agg(msgs)
     FROM 
       (
        SELECT * FROM messages
        WHERE chat_id = cu.chat_id
        ORDER BY created_at ASC
        ) AS msgs
      ) AS messages

    FROM userChats cu
    JOIN chats ON cu.chat_id = chats.id
      WHERE cu.user_id = $1 AND chats.id = $2
    `, [data.userId, data.chatId]);
    return rows
  }
  // ===== End =======

  static async getChatByUsersIds (data) {
    const { rows } = await pool.query(`
    SELECT c.*,
        ( SELECT jsonb_agg(users) FROM (
            SELECT u.id AS user_id, u.avatar, u.last_name , u.first_name , u.connection_status FROM users u
              WHERE u.id IN (
                SELECT uc.user_id FROM userChats uc
                  WHERE uc.chat_id = c.id)
                  ) AS users
              ) AS users
        ,

        ( SELECT jsonb_agg(messages) FROM (
          SELECT * FROM messages ms
          WHERE ms.chat_id = c.id
          ORDER BY created_at ASC
        ) AS messages ) AS messages

        FROM chats c
        JOIN (
            SELECT chat_id
            FROM userChats
            WHERE user_id IN ($1, $2)
            GROUP BY chat_id
            HAVING COUNT(DISTINCT user_id) = 2
        ) AS cu ON c.id = cu.chat_id `
    , [data.userId1, data.userId2])
    return rows[0]
  }

  static async counter () {
    const { rows } = await pool.query(`
    SELECT COUNT(*) FROM chats ;
    `)

    return rows[0].count
  }

  static async insert () {
    const noReadMessagesCounter = 1;
    const { rows } = await pool.query(`
    INSERT INTO chats
        (no_read_messages)
    VALUES
        ($1)
    RETURNING * ;
    `, [noReadMessagesCounter])

    return rows[0]
  }

  static async updateChatLastMessageIdField ({ chatId, messageId }) {
    const { rows } = await pool.query(`
         UPDATE chats
           SET last_message_id  = $2
             WHERE id= $1
             RETURNING *;
         `, [chatId, messageId])
    return rows[0]
  }

  static async getChatById (chatId) {
    const { rows } = await pool.query(`
      SELECT * FROM chats
        WHERE id = $1`, [chatId]);
    return rows[0]
  }
}

module.exports = Chat
