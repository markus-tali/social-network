-- +goose Up
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
 fromUser TEXT NOT NULL,
  message TEXT NOT NULL,
   toUser TEXT NOT NULL,
    date TEXT NOT NULL);
-- +goose Down
DROP TABLE messages;
