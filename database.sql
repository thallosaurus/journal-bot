CREATE TABLE IF NOT EXISTS users (
    id INTEGER NOT NULL,
    username TEXT NOT NULL,
    channelId INTEGER NOT NULL
  );

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY UNIQUE,
    author INTEGER,
    origin INTEGER NOT NULL,
    timestamp INTEGER,
    content TEXT
  );

CREATE TABLE IF NOT EXISTS attachments (
    id INTEGER,
    data BLOB,
    mime TEXT
)