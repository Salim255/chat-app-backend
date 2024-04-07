/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
  CREATE TABLE user-chat (
        id SERIAL PRIMARY KEY,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        user_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,

        chat_id INTEGER NOT NULL REFERENCES chat(id) ON DELETE CASCADE
  )
    `)
}

exports.down = pgm => {
  pgm.sql(`
        DROP TABLE user-chat
    `)
}
