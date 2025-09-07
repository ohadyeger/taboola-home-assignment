-- Initialize ClickHouse schema and seed data
CREATE DATABASE IF NOT EXISTS appdb;

CREATE TABLE IF NOT EXISTS appdb.items
(
    id UInt32,
    name String,
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree
ORDER BY id;

INSERT INTO appdb.items (id, name)
VALUES
    (1, 'First item'),
    (2, 'Second item'),
    (3, 'Third item');

