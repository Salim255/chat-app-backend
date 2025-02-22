const pool = require('../config/pool')

class User {
  static async insert (data) {
    const { rows } = await pool.query(`
      INSERT INTO users
          (first_name, last_name, email, password, is_staff)
      VALUES
          ($1, $2, $3, $4, $5) RETURNING *;`,
    [data.firstName, data.lastName, data.email, data.hashedPassword, data.isStaff]
    )
    return rows[0]
  }

  static async getUserById (userId) {
    const { rows } = await pool.query(`
        SELECT * FROM users WHERE id = $1 ;
    `, [userId])

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

  static async count () {
    const { rows } = await pool.query(`
        SELECT COUNT(*) FROM users ;
    `)
    return rows[0].count
  }

  static async disableUser (userId) {
    const { rows } = await pool.query(`
        UPDATE users
        SET is_active = $1
        WHERE users.id = $2 RETURNING *;
    `, [false, userId])

    return rows[0]
  }

  static async updateUser (query, values) {
    const { rows } = await pool.query(query, values);
    return rows[0]
  }

  static async updateUserConnectionStatus (userId, connectionStatus) {
    const { rows } = await pool.query(`
      UPDATE users
      SET connection_status = $1
      WHERE users.id = $2
      RETURNING id, first_name, last_name, avatar, connection_status;
    `, [connectionStatus, userId]);
    return rows[0];
  }

  static async deleteUser (userId) {}

  static create () {
    return 1
  }
}

module.exports = User
