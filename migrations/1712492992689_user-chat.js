/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
  CREATE TABLE userChats (
        id SERIAL PRIMARY KEY,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

        chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,

        is_admin BOOLEAN DEFAULT FALSE,

        UNIQUE(user_id, chat_id) -- To Ensure a user is only in a chat once
  )
    `)
}

exports.down = pgm => {
  pgm.sql(`
        DROP TABLE userChats
    `)
}
