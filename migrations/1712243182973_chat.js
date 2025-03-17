/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE chats (
        id SERIAL PRIMARY KEY,
        
        type VARCHAR(25) DEFAULT 'dual',

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        last_message_id INTEGER,

        no_read_messages INTEGER DEFAULT 0
    );
  `)
}

exports.down = pgm => {
  pgm.sql(`DROP TABLE chats;`)
}
