-- +goose Up
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    avatar TEXT DEFAULT "",
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- +goose Down
DROP TABLE posts;