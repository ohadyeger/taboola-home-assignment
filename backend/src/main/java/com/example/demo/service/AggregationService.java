package com.example.demo.service;

import com.example.demo.model.AggregatedMetrics;
import com.example.demo.model.PaginatedResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AggregationService {
    private final JdbcTemplate jdbcTemplate;

    public AggregationService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<AggregatedMetrics> getAggregatedData(UUID accountId, List<String> groupByDimensions, 
                                                    List<String> metrics, String countryFilter, String campaignFilter, String platformFilter, String browserFilter, boolean isAdmin, String sortBy, String sortDirection, String startDate, String endDate) {
        
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
        List<String> whereConditions = new ArrayList<>();
        if (!isAdmin) {
            whereConditions.add("account_id = ?");
        }
        if (countryFilter != null && !countryFilter.equals("All")) {
            whereConditions.add("country = ?");
        }
        if (campaignFilter != null && !campaignFilter.equals("All")) {
            whereConditions.add("campaign = ?");
        }
        if (platformFilter != null && !platformFilter.equals("All")) {
            whereConditions.add("platform = ?");
        }
        if (browserFilter != null && !browserFilter.equals("All")) {
            whereConditions.add("browser = ?");
        }
        if (startDate != null && !startDate.isEmpty()) {
            whereConditions.add("day >= ?");
        }
        if (endDate != null && !endDate.isEmpty()) {
            whereConditions.add("day <= ?");
        }
        
        String whereClause = whereConditions.isEmpty() ? "" : 
            "WHERE " + String.join(" AND ", whereConditions);
        
        // Build ORDER BY clause
        String orderByClause = "";
        if (sortBy != null && !sortBy.isEmpty()) {
            String direction = (sortDirection != null && sortDirection.equalsIgnoreCase("desc")) ? "DESC" : "ASC";
            switch (sortBy.toLowerCase()) {
                case "spent":
                    orderByClause = "ORDER BY total_spent " + direction;
                    break;
                case "impressions":
                    orderByClause = "ORDER BY total_impressions " + direction;
                    break;
                case "clicks":
                    orderByClause = "ORDER BY total_clicks " + direction;
                    break;
                default:
                    // Default to group by dimensions if invalid sort field
                    orderByClause = groupByDimensions.isEmpty() ? "" : 
                        "ORDER BY " + String.join(", ", groupByDimensions);
                    break;
            }
        } else {
            // Default ordering by group by dimensions
            orderByClause = groupByDimensions.isEmpty() ? "" : 
                "ORDER BY " + String.join(", ", groupByDimensions);
        }
        
        String sql = String.format(
            "SELECT %s %s FROM appdb.ads_metrics %s %s %s",
            dimensionSelect, metricSelect, whereClause, groupByClause, orderByClause
        ).trim();
        
        // Execute query
        List<Object> params = new ArrayList<>();
        if (!isAdmin) {
            params.add(accountId);
        }
        if (countryFilter != null && !countryFilter.equals("All")) {
            params.add(countryFilter);
        }
        if (campaignFilter != null && !campaignFilter.equals("All")) {
            params.add(campaignFilter);
        }
        if (platformFilter != null && !platformFilter.equals("All")) {
            params.add(platformFilter);
        }
        if (browserFilter != null && !browserFilter.equals("All")) {
            params.add(browserFilter);
        }
        if (startDate != null && !startDate.isEmpty()) {
            params.add(startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            params.add(endDate);
        }
        
        if (isAdmin) {
            return jdbcTemplate.query(sql, (rs, rowNum) -> {
                Map<String, Object> dimensions = new HashMap<>();
                for (String dim : groupByDimensions) {
                    dimensions.put(dim, rs.getObject(dim));
                }
                
                BigDecimal totalSpent = metrics.contains("spent") ? rs.getBigDecimal("total_spent") : BigDecimal.ZERO;
                Long totalImpressions = metrics.contains("impressions") ? rs.getLong("total_impressions") : 0L;
                Long totalClicks = metrics.contains("clicks") ? rs.getLong("total_clicks") : 0L;
                Long recordCount = rs.getLong("record_count");
                
                return new AggregatedMetrics(dimensions, totalSpent, totalImpressions, totalClicks, recordCount.intValue());
            }, params.toArray());
        } else {
            return jdbcTemplate.query(sql, (rs, rowNum) -> {
                Map<String, Object> dimensions = new HashMap<>();
                for (String dim : groupByDimensions) {
                    dimensions.put(dim, rs.getObject(dim));
                }
                
                BigDecimal totalSpent = metrics.contains("spent") ? rs.getBigDecimal("total_spent") : BigDecimal.ZERO;
                Long totalImpressions = metrics.contains("impressions") ? rs.getLong("total_impressions") : 0L;
                Long totalClicks = metrics.contains("clicks") ? rs.getLong("total_clicks") : 0L;
                Long recordCount = rs.getLong("record_count");
                
                return new AggregatedMetrics(dimensions, totalSpent, totalImpressions, totalClicks, recordCount.intValue());
            }, params.toArray());
        }
    }

    public PaginatedResponse<AggregatedMetrics> getAggregatedDataPaginated(UUID accountId, List<String> groupByDimensions, 
                                                                          List<String> metrics, String countryFilter, String campaignFilter, String platformFilter, String browserFilter, boolean isAdmin, int page, int size, String sortBy, String sortDirection, String startDate, String endDate) {
        
        int offset = page * size;
        
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
        List<String> whereConditions = new ArrayList<>();
        if (!isAdmin) {
            whereConditions.add("account_id = ?");
        }
        if (countryFilter != null && !countryFilter.equals("All")) {
            whereConditions.add("country = ?");
        }
        if (campaignFilter != null && !campaignFilter.equals("All")) {
            whereConditions.add("campaign = ?");
        }
        if (platformFilter != null && !platformFilter.equals("All")) {
            whereConditions.add("platform = ?");
        }
        if (browserFilter != null && !browserFilter.equals("All")) {
            whereConditions.add("browser = ?");
        }
        if (startDate != null && !startDate.isEmpty()) {
            whereConditions.add("day >= ?");
        }
        if (endDate != null && !endDate.isEmpty()) {
            whereConditions.add("day <= ?");
        }
        
        String whereClause = whereConditions.isEmpty() ? "" : 
            "WHERE " + String.join(" AND ", whereConditions);
        
        // Build ORDER BY clause
        String orderByClause = "";
        if (sortBy != null && !sortBy.isEmpty()) {
            String direction = (sortDirection != null && sortDirection.equalsIgnoreCase("desc")) ? "DESC" : "ASC";
            switch (sortBy.toLowerCase()) {
                case "spent":
                    orderByClause = "ORDER BY total_spent " + direction;
                    break;
                case "impressions":
                    orderByClause = "ORDER BY total_impressions " + direction;
                    break;
                case "clicks":
                    orderByClause = "ORDER BY total_clicks " + direction;
                    break;
                default:
                    // Default to group by dimensions if invalid sort field
                    orderByClause = groupByDimensions.isEmpty() ? "" : 
                        "ORDER BY " + String.join(", ", groupByDimensions);
                    break;
            }
        } else {
            // Default ordering by group by dimensions
            orderByClause = groupByDimensions.isEmpty() ? "" : 
                "ORDER BY " + String.join(", ", groupByDimensions);
        }
        
        // Build the main query
        String sql = String.format(
            "SELECT %s %s FROM appdb.ads_metrics %s %s %s",
            dimensionSelect, metricSelect, whereClause, groupByClause, orderByClause
        ).trim();
        
        // Get total count - count distinct groups
        String countSql = String.format(
            "SELECT COUNT(DISTINCT (%s)) FROM appdb.ads_metrics %s",
            groupByDimensions.isEmpty() ? "1" : String.join(", ", groupByDimensions),
            whereClause
        ).trim();
        
        // Execute count query
        List<Object> countParams = new ArrayList<>();
        if (!isAdmin) {
            countParams.add(accountId);
        }
        if (countryFilter != null && !countryFilter.equals("All")) {
            countParams.add(countryFilter);
        }
        if (campaignFilter != null && !campaignFilter.equals("All")) {
            countParams.add(campaignFilter);
        }
        if (platformFilter != null && !platformFilter.equals("All")) {
            countParams.add(platformFilter);
        }
        if (browserFilter != null && !browserFilter.equals("All")) {
            countParams.add(browserFilter);
        }
        if (startDate != null && !startDate.isEmpty()) {
            countParams.add(startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            countParams.add(endDate);
        }
        
        Long totalCount = jdbcTemplate.queryForObject(countSql, Long.class, countParams.toArray());
        if (totalCount == null) totalCount = 0L;
        
        // Add LIMIT and OFFSET to main query
        String paginatedSql = sql + " LIMIT ? OFFSET ?";
        
        // Execute paginated query
        List<Object> params = new ArrayList<>();
        if (!isAdmin) {
            params.add(accountId);
        }
        if (countryFilter != null && !countryFilter.equals("All")) {
            params.add(countryFilter);
        }
        if (campaignFilter != null && !campaignFilter.equals("All")) {
            params.add(campaignFilter);
        }
        if (platformFilter != null && !platformFilter.equals("All")) {
            params.add(platformFilter);
        }
        if (browserFilter != null && !browserFilter.equals("All")) {
            params.add(browserFilter);
        }
        if (startDate != null && !startDate.isEmpty()) {
            params.add(startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            params.add(endDate);
        }
        params.add(size);
        params.add(offset);
        
        List<AggregatedMetrics> data;
        if (isAdmin) {
            data = jdbcTemplate.query(paginatedSql, (rs, rowNum) -> {
                Map<String, Object> dimensions = new HashMap<>();
                for (String dim : groupByDimensions) {
                    dimensions.put(dim, rs.getObject(dim));
                }
                
                BigDecimal totalSpent = metrics.contains("spent") ? rs.getBigDecimal("total_spent") : BigDecimal.ZERO;
                Long totalImpressions = metrics.contains("impressions") ? rs.getLong("total_impressions") : 0L;
                Long totalClicks = metrics.contains("clicks") ? rs.getLong("total_clicks") : 0L;
                Long recordCount = rs.getLong("record_count");
                
                return new AggregatedMetrics(dimensions, totalSpent, totalImpressions, totalClicks, recordCount.intValue());
            }, params.toArray());
        } else {
            data = jdbcTemplate.query(paginatedSql, (rs, rowNum) -> {
                Map<String, Object> dimensions = new HashMap<>();
                for (String dim : groupByDimensions) {
                    dimensions.put(dim, rs.getObject(dim));
                }
                
                BigDecimal totalSpent = metrics.contains("spent") ? rs.getBigDecimal("total_spent") : BigDecimal.ZERO;
                Long totalImpressions = metrics.contains("impressions") ? rs.getLong("total_impressions") : 0L;
                Long totalClicks = metrics.contains("clicks") ? rs.getLong("total_clicks") : 0L;
                Long recordCount = rs.getLong("record_count");
                
                return new AggregatedMetrics(dimensions, totalSpent, totalImpressions, totalClicks, recordCount.intValue());
            }, params.toArray());
        }
        
        int totalPages = (int) Math.ceil((double) totalCount / size);
        return new PaginatedResponse<>(data, page, totalPages, totalCount.longValue(), size);
    }
}