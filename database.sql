CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY UNIQUE,
    username TEXT NOT NULL,
    origin INTEGER NOT NULL
  );

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY UNIQUE,
    author INTEGER,
    origin INTEGER NOT NULL,
    timestamp INTEGER,
    content TEXT
  )
