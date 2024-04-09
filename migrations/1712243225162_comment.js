/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE comments (
        id SERIAL PRIMARY KEY,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        content VARCHAR(1000),

        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
    )
    `)
}

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE comments ;
    `)
}
