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
    SELECT fr.id,fr.friend_id, fr.created_at, fr.updated_at, us.is_active, us.is_staff, us.first_name, us.last_name, us.email, us.avatar
    FROM
        users us
    JOIN friends fr ON  fr.friend_id = us.id
    WHERE
        fr.user_id = $1 OR fr.friend_id = $1
    `, [userId])

    return rows
  }

  static async getNonFriends (userId) {
    const { rows } = await pool.query(`
    SELECT us.id, us.created_at, us.updated_at, us.is_active, us.is_staff, us.first_name, us.last_name, us.email, us.avatar FROM users us
    JOIN  friends fr ON  fr.friend_id = us.id
    WHERE fr.user_id != $1 AND fr.friend_id != $1
    `, [userId])

    return rows
  }

  static async count () {
    const { rows } = await pool.query(`
        SELECT COUNT(*) FROM users;
    `)
    return rows[0].count
  }
}

module.exports = Friend
