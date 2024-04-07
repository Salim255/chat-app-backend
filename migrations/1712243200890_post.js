/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE post(
        id SERIAL PRIMARY KEY,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        captions VARCHAR(250),

        message VARCHAR(1000),

        user_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE
    )
    `)
}

exports.down = pgm => {
  pgm.sql(`
        DROP TABLE post;
    `)
}
