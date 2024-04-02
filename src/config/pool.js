const pg = require('pg')

class Pool {
    _pool = null
  connect (option) {
    this._pool = new pg.Pool(option)
    return this._pool.query('SELECT 1+1')
  }
}

module.exports = new Pool()