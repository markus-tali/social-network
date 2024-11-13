-- +goose Up
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
 fromUser TEXT NOT NULL,
  message TEXT NOT NULL ,
   toUser TEXT,
   group_id INTEGER,
    date TEXT NOT NULL,
    type TEXT NOT NULL);
-- +goose Down
DROP TABLE messages;
