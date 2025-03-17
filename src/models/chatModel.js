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
          SELECT uc.user_id FROM user_chats uc
            WHERE uc.chat_id = cu.chat_id)
            ) AS users
        ) AS users,

     (SELECT jsonb_agg(messages) FROM (
    SELECT * FROM messages
    WHERE chat_id = cu.chat_id
    ORDER BY created_at ASC
  ) AS messages) AS messages

    FROM user_chats cu
    JOIN chats ON cu.chat_id = chats.id
    WHERE cu.user_id = $1
    ORDER BY chats.updated_at
    `, [userId])
    return rows
  }

  // === Start =====
  static async getChatByChatId (data) {
    const { rows } = await pool.query(`
    SELECT
      chats.id,
      chats.type,
      chats.created_at,
      chats.updated_at,
      chats.last_message_id,
      chats.no_read_messages,
      
      -- Encrypted session key based on sender_id
      CASE 
        WHEN sk.sender_id = $1 THEN sk.encrypted_session_for_sender 
        ELSE sk.encrypted_session_for_receiver 
      END AS encrypted_session,

    ------ Get users in the chat ------
    (SELECT jsonb_agg(users)
     FROM (
      SELECT id, first_name, last_name, avatar, connection_status FROM users
        WHERE id IN (
          SELECT uc.user_id FROM user_chats uc
            WHERE uc.chat_id = chat_id)
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
        WHERE chat_id = uc.chat_id
        ORDER BY created_at ASC
        ) AS msgs
      ) AS messages
    ------ End messages getter ----------
  
    -----------------------Main table ------
    FROM user_chats uc
    
    ---------------Join chat by chat id-------------
    JOIN chats ON uc.chat_id = chats.id
    ----------------End join chat---------------------

    --------------Join session keys by chat id -------
    LEFT JOIN session_keys sk ON sk.chat_id = chats.id
    --------------End join session keys -----------

    WHERE uc.user_id = $1 AND chats.id = $2
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
                SELECT uc.user_id FROM user_chats uc
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
            FROM user_chats
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
           SET last_message_id  = $2,
                updated_at = CURRENT_TIMESTAMP
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

  static async getLastMessageDetails (chatId) {
    const { rows } = await pool.query(
      `SELECT 
          chats.last_message_id,

        (SELECT row_to_json(msg)
          FROM (
            SELECT 
              m.from_user_id,
              m.status
             FROM messages AS m
              WHERE chats.last_message_id = m.id AND chat_id = $1
            ) AS msg 
        ) AS last_message

        FROM chats 
          WHERE chats.id = $1 ;
      `, [chatId]);
    return rows[0];
  }

  static async resetChatMessagesCounter (chatId) {
    const { rows } = await pool.query(`
      UPDATE chats
        SET no_read_messages = $2
        WHERE id = $1
        RETURNING *;
    `, [chatId, 0]);

    return rows[0];
  }

  static async incrementChatMessagesCounter (chatId) {
    const { rows } = await pool.query(`
        UPDATE chats
          SET no_read_messages = no_read_messages + 1
          WHERE id = $1
          RETURNING *;
      `, [chatId]);

    return rows[0];
  }

  static async updateCounter ({ chatId, fromUserId }) {
    // Get chant with with last message
  /*   ( SELECT row_to_join (msg)
    FROM (
      SELECT * FROM messages
        WHERE id = last_message_id AND chat_id = $1
      ) AS msg
  ) AS last_message  , */
    const { rows } = await pool.query(
      `SELECT 
          chats.last_message_id,

        (SELECT row_to_json(msg)
          FROM (
            SELECT 
              m.from_user_id,
              m.status
             FROM messages AS m
              WHERE chats.last_message_id = m.id AND chat_id = $1
            ) AS msg 
        ) AS last_message

        FROM chats 
          WHERE chats.id = $1 ;
      `, [chatId]);
    return rows[0];
  }
}

module.exports = Chat
