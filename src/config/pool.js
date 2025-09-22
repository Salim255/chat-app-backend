const pg = require('pg')

class Pool {
  _pool = null

  connect (option) {
    this._pool = new pg.Pool(option)
    return this._pool.query('SELECT 1 + 1;')
  }

  close () {
    return this._pool.end()
  }

  query (sql, params) {
    return this._pool.query(sql, params)
  }

  // Get a dedicated client for transactions
  async getClient () {
    const client = await this._pool.connect(); // Get client connection
    return client;
  }
}

module.exports = new Pool()
