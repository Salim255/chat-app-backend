const dbConfig = require('./db')

module.exports = {
  host: dbConfig.db_host,
  port: dbConfig.db_port,
  database: dbConfig.database,
  user: dbConfig.db_user,
  password: dbConfig.db_password
}
