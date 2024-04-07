/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE reactions (
        id SERIAL PRIMARY KEY,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        type VARCHAR(25),

        post_id INTEGER,

        message_id INTEGER,

        comment_id INTEGER,

        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
    )
    `)
}

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE reaction ;
    `)
}
