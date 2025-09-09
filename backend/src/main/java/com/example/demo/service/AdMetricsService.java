package com.example.demo.service;

import com.example.demo.model.AdMetrics;
import com.example.demo.model.PaginatedResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AdMetricsService {
    private final JdbcTemplate jdbcTemplate;

    public AdMetricsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<AdMetrics> getAllMetrics() {
        return jdbcTemplate.query(
            "SELECT toString(day) as day, toString(week) as week, toString(month) as month, " +
            "account_id, campaign, country, platform, browser, " +
            "sum(spent) as spent, sum(impressions) as impressions, sum(clicks) as clicks " +
            "FROM appdb.ads_metrics " +
            "GROUP BY day, week, month, account_id, campaign, country, platform, browser " +
            "ORDER BY day DESC, account_id, campaign",
            (rs, rowNum) -> new AdMetrics(
                rs.getString("day"),
                rs.getString("week"),
                rs.getString("month"),
                UUID.fromString(rs.getString("account_id")),
                rs.getString("campaign"),
                rs.getString("country"),
                rs.getString("platform"),
                rs.getString("browser"),
                rs.getBigDecimal("spent"),
                rs.getLong("impressions"),
                rs.getLong("clicks")
            )
        );
    }

    public PaginatedResponse<AdMetrics> getAllMetricsPaginated(int page, int size) {
        int offset = page * size;
        
        // Get total count - simplified for ClickHouse
        Long totalCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(DISTINCT (day, week, month, account_id, campaign, country, platform, browser)) FROM appdb.ads_metrics",
            Long.class
        );
        
        // Get paginated data
        List<AdMetrics> data = jdbcTemplate.query(
            "SELECT toString(day) as day, toString(week) as week, toString(month) as month, " +
            "account_id, campaign, country, platform, browser, " +
            "sum(spent) as spent, sum(impressions) as impressions, sum(clicks) as clicks " +
            "FROM appdb.ads_metrics " +
            "GROUP BY day, week, month, account_id, campaign, country, platform, browser " +
            "ORDER BY day DESC, account_id, campaign " +
            "LIMIT ? OFFSET ?",
            (rs, rowNum) -> new AdMetrics(
                rs.getString("day"),
                rs.getString("week"),
                rs.getString("month"),
                UUID.fromString(rs.getString("account_id")),
                rs.getString("campaign"),
                rs.getString("country"),
                rs.getString("platform"),
                rs.getString("browser"),
                rs.getBigDecimal("spent"),
                rs.getLong("impressions"),
                rs.getLong("clicks")
            ),
            size, offset
        );
        
        int totalPages = (int) Math.ceil((double) totalCount / size);
        return new PaginatedResponse<>(data, page, totalPages, totalCount, size);
    }

    public List<AdMetrics> getMetricsByAccountId(UUID accountId) {
        return jdbcTemplate.query(
            "SELECT toString(day) as day, toString(week) as week, toString(month) as month, " +
            "account_id, campaign, country, platform, browser, " +
            "sum(spent) as spent, sum(impressions) as impressions, sum(clicks) as clicks " +
            "FROM appdb.ads_metrics " +
            "WHERE account_id = ? " +
            "GROUP BY day, week, month, account_id, campaign, country, platform, browser " +
            "ORDER BY day DESC, campaign",
            (rs, rowNum) -> new AdMetrics(
                rs.getString("day"),
                rs.getString("week"),
                rs.getString("month"),
                UUID.fromString(rs.getString("account_id")),
                rs.getString("campaign"),
                rs.getString("country"),
                rs.getString("platform"),
                rs.getString("browser"),
                rs.getBigDecimal("spent"),
                rs.getLong("impressions"),
                rs.getLong("clicks")
            ),
            accountId
        );
    }

    public PaginatedResponse<AdMetrics> getMetricsByAccountIdPaginated(UUID accountId, int page, int size) {
        int offset = page * size;
        
        // Get total count - simplified for ClickHouse
        Long totalCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(DISTINCT (day, week, month, account_id, campaign, country, platform, browser)) FROM appdb.ads_metrics WHERE account_id = ?",
            Long.class,
            accountId
        );
        
        // Get paginated data
        List<AdMetrics> data = jdbcTemplate.query(
            "SELECT toString(day) as day, toString(week) as week, toString(month) as month, " +
            "account_id, campaign, country, platform, browser, " +
            "sum(spent) as spent, sum(impressions) as impressions, sum(clicks) as clicks " +
            "FROM appdb.ads_metrics " +
            "WHERE account_id = ? " +
            "GROUP BY day, week, month, account_id, campaign, country, platform, browser " +
            "ORDER BY day DESC, campaign " +
            "LIMIT ? OFFSET ?",
            (rs, rowNum) -> new AdMetrics(
                rs.getString("day"),
                rs.getString("week"),
                rs.getString("month"),
                UUID.fromString(rs.getString("account_id")),
                rs.getString("campaign"),
                rs.getString("country"),
                rs.getString("platform"),
                rs.getString("browser"),
                rs.getBigDecimal("spent"),
                rs.getLong("impressions"),
                rs.getLong("clicks")
            ),
            accountId, size, offset
        );
        
        int totalPages = (int) Math.ceil((double) totalCount / size);
        return new PaginatedResponse<>(data, page, totalPages, totalCount, size);
    }

    public List<String> getAvailableCountries() {
        return jdbcTemplate.queryForList(
            "SELECT DISTINCT country FROM appdb.ads_metrics ORDER BY country",
            String.class
        );
    }

    public List<String> getAvailableCountriesByAccountId(UUID accountId) {
        return jdbcTemplate.queryForList(
            "SELECT DISTINCT country FROM appdb.ads_metrics WHERE account_id = ? ORDER BY country",
            String.class,
            accountId
        );
    }

    public List<String> getAvailableCampaigns() {
        return jdbcTemplate.queryForList(
            "SELECT DISTINCT campaign FROM appdb.ads_metrics ORDER BY campaign",
            String.class
        );
    }

    public List<String> getAvailableCampaignsByAccountId(UUID accountId) {
        return jdbcTemplate.queryForList(
            "SELECT DISTINCT campaign FROM appdb.ads_metrics WHERE account_id = ? ORDER BY campaign",
            String.class,
            accountId
        );
    }

    public List<String> getAvailablePlatforms() {
        return jdbcTemplate.queryForList(
            "SELECT DISTINCT platform FROM appdb.ads_metrics ORDER BY platform",
            String.class
        );
    }

    public List<String> getAvailablePlatformsByAccountId(UUID accountId) {
        return jdbcTemplate.queryForList(
            "SELECT DISTINCT platform FROM appdb.ads_metrics WHERE account_id = ? ORDER BY platform",
            String.class,
            accountId
        );
    }

    public List<String> getAvailableBrowsers() {
        return jdbcTemplate.queryForList(
            "SELECT DISTINCT browser FROM appdb.ads_metrics ORDER BY browser",
            String.class
        );
    }

    public List<String> getAvailableBrowsersByAccountId(UUID accountId) {
        return jdbcTemplate.queryForList(
            "SELECT DISTINCT browser FROM appdb.ads_metrics WHERE account_id = ? ORDER BY browser",
            String.class,
            accountId
        );
    }
}
