const pool = require('../config/pool')

class User {
  static async insert (data) {
    const { rows } = await pool.query(`
    INSERT INTO users
        (first_name, last_name, email, password)
    VALUES
        ($1, $2, $3, $4) RETURNING *;`,
    [data.firstName, data.lastName, data.email, data.hashedPassword]
    )
    return rows[0]
  }

  static async getUser (data) {
    const { rows } = await pool.query(`
    SELECT * FROM users
      WHERE
        email = $1 ;
    `, [data.email])

    return rows[0]
  }

  static async counter () {
    const { rows } = await pool.query(`
        SELECT COUNT(*) FROM users ;
    `)
    return rows[0].count
  }

  static create () {
    return 1
  }
}

module.exports = User
