DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  username VARCHAR(50),
  hashed_password VARCHAR(255)
);