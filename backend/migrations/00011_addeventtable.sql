-- +goose Up
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    group_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    time DATETIME NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);
CREATE TABLE eventsStatus(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId INTEGER NOT NULL,
    username TEXT NOT NULL,
    pending TEXT CHECK(pending IN ('pending', 'going', 'not going')),
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
);
-- +goose Down
DROP TABLE events;
DROP TABLE eventsStatus;