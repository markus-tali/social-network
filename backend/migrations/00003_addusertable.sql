-- +goose Up
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    dateOfBirth DATETIME NOT NULL,
    avatar TEXT DEFAULT '',
    nickname TEXT DEFAULT '',
    aboutMe TEXT DEFAULT '',
    isPrivate INTEGER DEFAULT 0, -- 0 for false, 1 for true 
    followedBy TEXT DEFAULT '[]',
    isFollowing TEXT DEFAULT '[]'
);
-- +goose Down
DROP TABLE users;