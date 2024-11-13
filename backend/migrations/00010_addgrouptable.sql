
-- +goose Up
CREATE TABLE groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator TEXT NOT NULL,
    title TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    FOREIGN KEY (creator) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE group_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
    UNIQUE(group_id, username)
);



-- +goose Down
DROP TABLE group_members;
DROP TABLE groups;