/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(
  `
      CREATE TABLE 'user' (
            id SERIAL PRIMARY KEY,

            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            first_name VARCHAR(30),

            last_name VARCHAR(30),

            avatar VARCHAR(250),

            email VARCHAR(50) NOT NULL UNIQUE,

            password VARCHAR NOT NULL,

            is_staff BOOLEAN DEFAULT FALSE,

            is_active BOOLEAN DEFAULT TRUE

                  );

  `,

  );
}

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE user;
    `)
}
