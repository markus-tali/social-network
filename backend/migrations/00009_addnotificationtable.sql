-- +goose Up
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_username TEXT NOT NULL,
    followed_username TEXT NOT NULL,
    message TEXT DEFAULT 'New follow request',
    FOREIGN KEY (follower_username) REFERENCES users(username),
    FOREIGN KEY (followed_username) REFERENCES users(username)
);
-- +goose Down
DROP TABLE notifications;