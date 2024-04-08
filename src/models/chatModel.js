const pool = require('../config/pool')
class Chat {
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
