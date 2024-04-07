/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE messages (
        id SERIAL PRIMARY KEY,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        content VARCHAR(1000),

        from_user_id INTEGER,

        chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE
    );
`)
}

exports.down = pgm => {
  pgm.sql(`
  DROP TABLE message
    `)
}
