const pool = require('../config/pool');

class SessionKeys {
  static async insert ({ chatId, senderId, receiverId, encryptedSessionForSender, encryptedSessionForReceiver }) {
    const { rows } = await pool.query(`
        INSERT INTO session_keys
            (
            chat_id, 
            sender_id,
            receiver_id, 
            encrypted_session_for_sender, 
            encrypted_session_for_receiver 
            )

            VALUES( $1, $2, $3, $4, $5 ) RETURNING *;`
    , [
      chatId,
      senderId,
      receiverId,
      encryptedSessionForSender,
      encryptedSessionForReceiver
    ]);
    return rows[0]
  }
}

module.exports = SessionKeys;
