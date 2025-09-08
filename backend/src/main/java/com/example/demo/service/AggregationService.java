package com.example.demo.service;

import com.example.demo.model.AggregatedMetrics;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AggregationService {
    private final JdbcTemplate jdbcTemplate;

    public AggregationService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<AggregatedMetrics> getAggregatedData(UUID accountId, List<String> groupByDimensions, 
                                                    List<String> metrics, boolean isAdmin) {
        
        // Build the GROUP BY clause
        String groupByClause = groupByDimensions.isEmpty() ? "" : 
            "GROUP BY " + String.join(", ", groupByDimensions);
        
        // Build the SELECT clause for dimensions
        String dimensionSelect = groupByDimensions.isEmpty() ? "" : 
            String.join(", ", groupByDimensions) + ", ";
        
        // Build the SELECT clause for metrics
        List<String> metricSelects = new ArrayList<>();
        if (metrics.contains("spent")) {
            metricSelects.add("sum(spent) as total_spent");
        }
        if (metrics.contains("impressions")) {
            metricSelects.add("sum(impressions) as total_impressions");
        }
        if (metrics.contains("clicks")) {
            metricSelects.add("sum(clicks) as total_clicks");
        }
        metricSelects.add("count(*) as record_count");
        
        String metricSelect = String.join(", ", metricSelects);
        
        // Build WHERE clause
        String whereClause = isAdmin ? "" : "WHERE account_id = ?";
        
        // Build ORDER BY clause
        String orderByClause = groupByDimensions.isEmpty() ? "" : 
            "ORDER BY " + String.join(", ", groupByDimensions);
        
        String sql = String.format(
            "SELECT %s %s FROM appdb.ads_metrics %s %s %s",
            dimensionSelect, metricSelect, whereClause, groupByClause, orderByClause
        ).trim();
        
        // Execute query
        if (isAdmin) {
            return jdbcTemplate.query(sql, (rs, rowNum) -> {
                Map<String, Object> dimensions = new HashMap<>();
                for (String dim : groupByDimensions) {
                    dimensions.put(dim, rs.getObject(dim));
                }
                
                BigDecimal totalSpent = metrics.contains("spent") ? rs.getBigDecimal("total_spent") : BigDecimal.ZERO;
                Long totalImpressions = metrics.contains("impressions") ? rs.getLong("total_impressions") : 0L;
                Long totalClicks = metrics.contains("clicks") ? rs.getLong("total_clicks") : 0L;
                Integer recordCount = rs.getInt("record_count");
                
                return new AggregatedMetrics(dimensions, totalSpent, totalImpressions, totalClicks, recordCount);
            });
        } else {
            return jdbcTemplate.query(sql, (rs, rowNum) -> {
                Map<String, Object> dimensions = new HashMap<>();
                for (String dim : groupByDimensions) {
                    dimensions.put(dim, rs.getObject(dim));
                }
                
                BigDecimal totalSpent = metrics.contains("spent") ? rs.getBigDecimal("total_spent") : BigDecimal.ZERO;
                Long totalImpressions = metrics.contains("impressions") ? rs.getLong("total_impressions") : 0L;
                Long totalClicks = metrics.contains("clicks") ? rs.getLong("total_clicks") : 0L;
                Integer recordCount = rs.getInt("record_count");
                
                return new AggregatedMetrics(dimensions, totalSpent, totalImpressions, totalClicks, recordCount);
            }, accountId);
        }
    }
}
