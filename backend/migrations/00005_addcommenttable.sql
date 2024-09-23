-- +goose Up
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER ,
    postId INTEGER NOT NULL,
    creator TEXT NOT NULL,
    content TEXT NOT NULL,
    avatar TEXT DEFAULT "",
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE comments;
