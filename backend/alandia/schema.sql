PRAGMA foreign_keys = ON;

CREATE TABLE province (
    id   INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE park (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT NOT NULL,
    latitude    REAL NOT NULL,
    longitude   REAL NOT NULL,
    phone       TEXT,
    province_id INTEGER NOT NULL REFERENCES province (id),
    -- "lang:Title" of the park's Wikipedia page, used by the app for a photo and a summary
    wikipedia   TEXT
);

CREATE TABLE app_user (
    id            INTEGER PRIMARY KEY,
    pseudo        TEXT NOT NULL UNIQUE COLLATE NOCASE,
    email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE rating (
    user_id INTEGER NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    park_id INTEGER NOT NULL REFERENCES park (id) ON DELETE CASCADE,
    score   INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
    PRIMARY KEY (user_id, park_id)
);

CREATE TABLE comment (
    id         INTEGER PRIMARY KEY,
    park_id    INTEGER NOT NULL REFERENCES park (id) ON DELETE CASCADE,
    user_id    INTEGER NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    body       TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE forum_post (
    id         INTEGER PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    body       TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX park_province ON park (province_id);
CREATE INDEX comment_park ON comment (park_id);
