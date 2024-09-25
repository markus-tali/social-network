-- +goose Up

CREATE TABLE IF NOT EXISTS sessions (
    username TEXT PRIMARY KEY NOT NULL,
    cookie TEXT NOT NULL,
    expiresAt DATETIME NOT NULL
);

-- +goose Down
DROP TABLE sessions;
