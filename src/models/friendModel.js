const pool = require('../config/pool')

class Friend {
  static async insert (data) {
    const { rows } = await pool.query(`
    INSERT INTO friends (friend_id, user_id)
    VALUES ($1, $2) RETURNING *;
    `, [data.friend_id, data.userId])

    return rows[0]
  }

  static async getFriends (userId) {
    const { rows } = await pool.query(`
    SELECT fr.id, fr.created_at, fr.updated_at, fr.friend_id, fr.user_id, u.avatar, u.last_name, u.first_name, u.is_staff
    FROM users u
    LEFT JOIN friends fr ON fr.user_id = u.id OR  fr.friend_id = u.id
      WHERE (fr.user_id = $1 OR  fr.friend_id = $1) AND u.id <> $1  AND fr.status = 2;
    `, [userId])

    return rows
  }

  static async getNonFriends (userId) {
    const { rows } = await pool.query(`
    SELECT u.id, u.created_at, u.updated_at, u.first_name, u.last_name, u.avatar, u.is_staff
      FROM users u
      LEFT JOIN ( SELECT fr.id, fr.created_at, fr.updated_at, fr.friend_id, fr.user_id,
        fr.status, u.avatar, u.last_name, u.first_name
      FROM users u
      LEFT JOIN friends fr ON fr.user_id = u.id OR  fr.friend_id = u.id
        WHERE (fr.user_id = $1 OR  fr.friend_id = $1) AND u.id <> $1  AND fr.status = 2) r
          ON r.friend_id = u.id OR  r.user_id = u.id
      WHERE u.id <> $1 AND r.id IS NULL
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
