-- Initialize ClickHouse schema and seed data (no users)
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
    (3, 'Third item'),
    (4, 'Fourth item'),
    (5, 'Fifth item'),
    (6, 'Sixth item'),
    (7, 'Seventh item'),
    (8, 'Eighth item'),
    (9, 'Ninth item'),
    (10, 'Tenth item'),
    (11, 'Eleventh item'),
    (12, 'Twelfth item'),
    (13, 'Thirteenth item'),
    (14, 'Fourteenth item'),
    (15, 'Fifteenth item'),
    (16, 'Sixteenth item'),
    (17, 'Seventeenth item'),
    (18, 'Eighteenth item'),
    (19, 'Nineteenth item'),
    (20, 'Twentieth item'),
    (21, 'Twenty-first item'),
    (22, 'Twenty-second item'),
    (23, 'Twenty-third item'),
    (24, 'Twenty-fourth item'),
    (25, 'Twenty-fifth item'),
    (26, 'Twenty-sixth item'),
    (27, 'Twenty-seventh item'),
    (28, 'Twenty-eighth item'),
    (29, 'Twenty-ninth item'),
    (30, 'Thirtieth item'),
    (31, 'Thirty-first item'),
    (32, 'Thirty-second item'),
    (33, 'Thirty-third item'),
    (34, 'Thirty-fourth item'),
    (35, 'Thirty-fifth item'),
    (36, 'Thirty-sixth item'),
    (37, 'Thirty-seventh item'),
    (38, 'Thirty-eighth item'),
    (39, 'Thirty-ninth item'),
    (40, 'Fortieth item'),
    (41, 'Forty-first item'),
    (42, 'Forty-second item'),
    (43, 'Forty-third item'),
    (44, 'Forty-fourth item'),
    (45, 'Forty-fifth item'),
    (46, 'Forty-sixth item'),
    (47, 'Forty-seventh item'),
    (48, 'Forty-eighth item'),
    (49, 'Forty-ninth item'),
    (50, 'Fiftieth item');

-- Reporting table for ads metrics with dimensions and aggregated metrics
CREATE TABLE IF NOT EXISTS appdb.ads_metrics
(
    event_time DateTime,
    day Date MATERIALIZED toDate(event_time),
    week Date MATERIALIZED toStartOfWeek(event_time, 1),
    month Date MATERIALIZED toStartOfMonth(event_time),
    account_id UUID,
    campaign String,
    country FixedString(2),
    platform LowCardinality(String),
    browser LowCardinality(String),
    spent Decimal(18,6),
    impressions UInt64,
    clicks UInt64
)
ENGINE = SummingMergeTree((spent, impressions, clicks))
PARTITION BY toYYYYMM(day)
ORDER BY (day, account_id, campaign, country, platform, browser);

-- Mock data will be loaded from CSV files via Java StartupSeeder

-- Accounts table for simple user system
CREATE TABLE IF NOT EXISTS appdb.accounts
(
    id UUID,
    email String,
    password_hash String,
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree
ORDER BY (email);

