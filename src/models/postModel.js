const pool = require('../config/pool')

class Post {
  static async count () {
    const { rows } = await pool.query(`
       SELECT COUNT(*) FROM posts;
    `)
    return rows[0].count
  }

  static async insert (data) {
    const { rows } = await pool.query(`
        INSERT INTO posts (message, user_id)
        VALUES
            ($1, $2) RETURNING *;
        `, [data.message, data.userId])
    return rows[0]
  }

  static async updatePost (data) {
    const { rows } = await pool.query(`
        UPDATE posts
        SET message = $1
        WHERE posts.id = $2 RETURNING *
   `, [data.message, data.postId])

    return rows[0]
  }

  static async deletePost (postId) {
    const { rows } = await pool.query(`
    DELETE FROM posts
    WHERE posts.id = $1
    `, [postId])

    return rows[0]
  }
}

module.exports = Post
