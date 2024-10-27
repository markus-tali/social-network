-- +goose Up
CREATE TABLE follows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_username TEXT NOT NULL,
    followed_username TEXT NOT NULL,
    status TEXT DEFAULT 'accepted',
    FOREIGN KEY (follower_username) REFERENCES users(username),
    FOREIGN KEY (followed_username) REFERENCES users(username)
);
-- +goose Down
DROP TABLE follows;
