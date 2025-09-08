package com.example.demo.model;

import java.math.BigDecimal;
import java.util.Map;

public class AggregatedMetrics {
    private Map<String, Object> dimensions;
    private BigDecimal totalSpent;
    private Long totalImpressions;
    private Long totalClicks;
    private Integer recordCount;

    public AggregatedMetrics(Map<String, Object> dimensions, BigDecimal totalSpent, 
                           Long totalImpressions, Long totalClicks, Integer recordCount) {
        this.dimensions = dimensions;
        this.totalSpent = totalSpent;
        this.totalImpressions = totalImpressions;
        this.totalClicks = totalClicks;
        this.recordCount = recordCount;
    }

    public Map<String, Object> getDimensions() { return dimensions; }
    public BigDecimal getTotalSpent() { return totalSpent; }
    public Long getTotalImpressions() { return totalImpressions; }
    public Long getTotalClicks() { return totalClicks; }
    public Integer getRecordCount() { return recordCount; }
}
