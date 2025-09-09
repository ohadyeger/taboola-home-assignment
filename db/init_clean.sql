-- Initialize ClickHouse schema and seed data (no users)
CREATE DATABASE IF NOT EXISTS appdb;


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

