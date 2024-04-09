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
}

module.exports = Post
