/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE chats (
        id SERIAL PRIMARY KEY,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        type VARCHAR(25) DEFAULT 'dual'
    );
  `)
}

exports.down = pgm => {
  pgm.sql(`
  DROP TABLE chats;
    `)
}
