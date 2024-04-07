require('dotenv').config()
const pool = require('../config/pool')
const { randomBytes } = require('crypto')
const { default: migrate } = require('node-pg-migrate')
const format = require('pg-format')
const SCHEMA_OPTS = require('../config/testConnection')
const DEFAULT_OPTS = require('../config/testConnection')

class Context {
  constructor (roleName) {
    this.roleName = roleName
  }

  static async build () {
    // Generate random a role nam to connect to pg
    const roleName = 'a' + randomBytes(4).toString('hex')

    // Connection to PG

    await pool.connect(DEFAULT_OPTS)

    // Crete a new role
    await pool.query(format('CREATE %I WITH LOGIN PASSWORD %L', roleName, roleName))

    // Create schema
    await pool.query(format('CREATE SCHEMA %I AUTHORIZATION %I;', roleName, roleName))

    // Disconnect from PG
    await pool.close()

    // Apply app migration
    await migrate({
      schema: roleName,

      direction: 'up',

      log: () => {},

      noLock: true,

      dir: 'migrations',

      databaseUrl: {
        host: DEFAULT_OPTS.host,
        port: DEFAULT_OPTS.port,
        database: DEFAULT_OPTS.database,
        user: roleName,
        password: roleName
      }

    })

    // Connect to P£G with newly created role
    SCHEMA_OPTS.user = roleName
    SCHEMA_OPTS.password = roleName
    await pool.connect(SCHEMA_OPTS)
    return new Context(roleName)
  }

  async close () {
    // Disconnect from PG
    await pool.close()

    // Reconnect as our root user
    await pool.connect(DEFAULT_OPTS)

    // Delete created schema and role
    await pool.query(format('DROP SCHEMA %I CASCADE;', this.roleName))

    await pool.query(format('DROP ROLE %I;', this.roleName))

    // Disconnect
    await pool.close()
  }
}

module.exports = Context
