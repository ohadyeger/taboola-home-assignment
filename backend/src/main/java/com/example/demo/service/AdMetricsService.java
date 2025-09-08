package com.example.demo.service;

import com.example.demo.model.AdMetrics;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdMetricsService {
    private final JdbcTemplate jdbcTemplate;

    public AdMetricsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<AdMetrics> getAllMetrics() {
        return jdbcTemplate.query(
            "SELECT toString(day) as day, toString(week) as week, toString(month) as month, " +
            "account, campaign, country, platform, browser, " +
            "sum(spent) as spent, sum(impressions) as impressions, sum(clicks) as clicks " +
            "FROM appdb.ads_metrics " +
            "GROUP BY day, week, month, account, campaign, country, platform, browser " +
            "ORDER BY day DESC, account, campaign",
            (rs, rowNum) -> new AdMetrics(
                rs.getString("day"),
                rs.getString("week"),
                rs.getString("month"),
                rs.getString("account"),
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

    public List<AdMetrics> getMetricsByAccount(String accountEmail) {
        return jdbcTemplate.query(
            "SELECT toString(day) as day, toString(week) as week, toString(month) as month, " +
            "account, campaign, country, platform, browser, " +
            "sum(spent) as spent, sum(impressions) as impressions, sum(clicks) as clicks " +
            "FROM appdb.ads_metrics " +
            "WHERE account = ? " +
            "GROUP BY day, week, month, account, campaign, country, platform, browser " +
            "ORDER BY day DESC, campaign",
            (rs, rowNum) -> new AdMetrics(
                rs.getString("day"),
                rs.getString("week"),
                rs.getString("month"),
                rs.getString("account"),
                rs.getString("campaign"),
                rs.getString("country"),
                rs.getString("platform"),
                rs.getString("browser"),
                rs.getBigDecimal("spent"),
                rs.getLong("impressions"),
                rs.getLong("clicks")
            ),
            accountEmail
        );
    }
}
