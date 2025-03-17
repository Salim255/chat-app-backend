/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE user_keys (
    id SERIAL PRIMARY KEY, 
    user_id INT NOT NULL,
    public_key TEXT NOT NULL,                
    encrypted_private_key TEXT NOT NULL,      
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`)
};

exports.down = pgm => {
  pgm.sql(` DROP TABLE user_keys;`)
};
