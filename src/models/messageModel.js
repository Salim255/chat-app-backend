const pool = require('../config/pool')

class Message {
  static async count () {
    const { rows } = await pool.query(`
    SELECT COUNT(*) FROM messages ;
    `)

    return rows[0].count
  }
}

module.exports = Message
