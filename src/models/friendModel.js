const pool = require('../config/pool')

class Friend {
  static async insert ({ friendId, userId }) {
    const { rows } = await pool.query(`
    INSERT INTO friends (friend_id, user_id)
    VALUES ($1, $2) RETURNING *;
    `, [friendId, userId])

    return rows[0]
  }

  static async getFriends (userId) {
    const { rows } = await pool.query(`
      SELECT 
        u.id AS partner_id,
        u.first_name,
        u.last_name,
        u.avatar,
        u.connection_status
      FROM users u
    
      INNER JOIN friends fr
        ON (
          (fr.user_id = u.id AND fr.friend_id = $1)
          OR (fr.user_id = $1 AND fr.friend_id = u.id)
        )

      WHERE fr.status = 2 AND u.id != $1 AND  NOT EXISTS (
        SELECT 1
        FROM messages msg
        WHERE 
          (
          (msg.from_user_id = u.id AND msg.to_user_id = $1)
          OR (msg.to_user_id = u.id AND msg.from_user_id = $1)
          ) 
        )
        
      `, [userId]);

    return rows
  }

  static async getFriendShip ({ userId, friendId }) {
    const { rows } = await pool.query(`
    SELECT * FROM friends
    WHERE status = 1 AND friend_id = $1 AND user_id = $2 ;
    `, [userId, friendId])
    return rows[0]
  }

  static async acceptFriendShip ({ friendshipId, userId }) {
    const { rows } = await pool.query(`
    UPDATE friends
    SET status = 2
    WHERE id = $1 AND friend_id = $2 RETURNING *;
    `, [friendshipId, userId])
    return rows[0]
  }

  static async getNonFriends (userId) {
    const { rows } = await pool.query(`
    SELECT
      u.id, 
      u.created_at,
      u.updated_at,
      u.first_name,
      u.last_name,
      u.avatar,
      u.connection_status,
      u.is_staff

      FROM users u
      WHERE u.id != $1  AND 
        NOT EXISTS (
          -- Exclude the users in a friendship with the current user (with status 2)
          SELECT 1
          FROM friends fr
          WHERE 
            (
            (fr.user_id = u.id AND fr.friend_id = $1)
            OR (fr.friend_id = u.id AND fr.user_id = $1)
            ) 
            AND fr.status = 2 --- Only exclude accepted friends
            OR (fr.user_id = $1 AND fr.friend_id = u.id AND fr.status = 1) -- Exclude sent requests
        )
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
