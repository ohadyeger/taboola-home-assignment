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
    (3, 'Third item');

-- Reporting table for ads metrics with dimensions and aggregated metrics
CREATE TABLE IF NOT EXISTS appdb.ads_metrics
(
    event_time DateTime,
    day Date MATERIALIZED toDate(event_time),
    week Date MATERIALIZED toStartOfWeek(event_time, 1),
    month Date MATERIALIZED toStartOfMonth(event_time),
    account String,
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
ORDER BY (day, account, campaign, country, platform, browser);

-- Seed sample rows
INSERT INTO appdb.ads_metrics (event_time, account, campaign, country, platform, browser, spent, impressions, clicks) VALUES
    (now() - INTERVAL 2 DAY, 'admin@example.com', 'Camp 1', 'US', 'iOS', 'Safari', 12.34, 1000, 45),
    (now() - INTERVAL 2 DAY, 'admin@example.com', 'Camp 1', 'US', 'Android', 'Chrome', 8.21, 800, 30),
    (now() - INTERVAL 1 DAY, 'admin@example.com', 'Camp 2', 'GB', 'Web', 'Chrome', 20.00, 2000, 70),
    (now(),               'user@example.com', 'Camp X', 'DE', 'Web', 'Firefox', 15.50, 1200, 40);

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

