const pool = require('../config/pool');

class UserKeys {
  static async insert ({ publicKey, encryptedPrivateKey, userId }) {
    const { rows } = await pool.query(`
        INSERT INTO user_keys
            (public_key, encrypted_private_key, user_id) 
                VALUES($1, $2, $3) RETURNING *;
        `, [publicKey, encryptedPrivateKey, userId])
    return rows[0]
  }
}

module.exports = UserKeys;
