/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE messages (
        id SERIAL PRIMARY KEY,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        content TEXT,
    
        from_user_id INTEGER,

        to_user_id INTEGER,

        status VARCHAR(50) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),

        chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE
    );
`)
}

exports.down = pgm => {
  pgm.sql(`DROP TABLE messages;`)
}
