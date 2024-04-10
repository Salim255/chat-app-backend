const pool = require('../config/pool')

class Reaction {
  static async deletePostReaction (data) {
    const { rows } = await pool.query(`
    DELETE FROM reactions
    WHERE user_id = $1 AND post_id = $2;
    `, [data.userId, data.postId])

    return rows[0]
  }

  static async insert (data) {
    const { rows } = await pool.query(`
      INSERT INTO reactions (user_id, post_id, type)
      VALUES
        ($1, $2, $3) RETURNING *;
   `, [data.userId, data.postId, data.type])

    return rows[0]
  }

  static async count () {
    const { rows } = await pool.query(`
     SELECT COUNT(*)  FROM reactions ;
    `)
    return rows[0].count
  }
}

module.exports = Reaction
