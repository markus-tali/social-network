-- +goose Up
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_username TEXT,
    followed_username TEXT,
    message TEXT DEFAULT 'New follow request',
    group_id INTEGER NOT NULL,  -- Optional, only for group invitations

    notification_type TEXT NOT NULL, -- 'followRequest', 'groupInvitation', etc.
    FOREIGN KEY (follower_username) REFERENCES users(username),
    FOREIGN KEY (followed_username) REFERENCES users(username),
    FOREIGN KEY (group_id) REFERENCES groups(id) -- Reference to a groups table if it exists
);
-- +goose Down
DROP TABLE notifications;