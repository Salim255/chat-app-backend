const pool = require('../config/pool')

class Friend {
  static async insert (data) {
    const { rows } = await pool.query(`
    INSERT INTO friends (friend_id, user_id)
    VALUES ($1, $2) RETURNING *;
    `, [data.friendId, data.userId])

    return rows[0]
  }

  static async getFriends (userId) {
    const { rows } = await pool.query(`
    SELECT * FROM friends
    WHERE user_id = $1
    `, [userId])

    return rows[0]
  }

  static async getNonFriends (data) {
    // const { rows } = await pool.query(``)
  }
}

module.exports = Friend
