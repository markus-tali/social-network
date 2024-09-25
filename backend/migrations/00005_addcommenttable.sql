-- +goose Up
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postId TEXT NOT NULL,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    avatar TEXT DEFAULT "",
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE comments;
