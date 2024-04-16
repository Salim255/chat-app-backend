const pool = require('../config/pool')

class Comment {
  static async count () {
    const { rows } = await pool.query(`
    SELECT COUNT(*) FROM comments ;
       `)
    return rows[0].count
  }

  static async insert (data) {
    const { rows } = await pool.query(`
    INSERT INTO comments (content, user_id, post_id)
    VALUES
        ($1, $2, $3) RETURNING *;
    `, [data.content, data.userId, data.postId])

    return rows[0]
  }

  static async updateComment (data) {
    const { rows } = await pool.query(`
    UPDATE comments
    SET content = $1
    WHERE comments.id = $2 RETURNING *
    `, [data.content, data.commentId])

    return rows[0]
  }
}

module.exports = Comment
