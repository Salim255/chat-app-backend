/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(
    `
      CREATE TABLE friends (
        id SERIAL PRIMARY KEY,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        friend_id INTEGER NOT NULL,

        status INTEGER DEFAULT 2,

        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
      )
    `
  )
}

exports.down = pgm => {
  pgm.sql(`
      DROP TABLE friends;
      `)
}
