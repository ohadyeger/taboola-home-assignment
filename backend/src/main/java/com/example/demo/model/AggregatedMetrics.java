package com.example.demo.model;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Objects;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AggregatedMetrics that = (AggregatedMetrics) o;
        return Objects.equals(dimensions, that.dimensions) &&
                Objects.equals(totalSpent, that.totalSpent) &&
                Objects.equals(totalImpressions, that.totalImpressions) &&
                Objects.equals(totalClicks, that.totalClicks) &&
                Objects.equals(recordCount, that.recordCount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dimensions, totalSpent, totalImpressions, totalClicks, recordCount);
    }

    @Override
    public String toString() {
        return "AggregatedMetrics{" +
                "dimensions=" + dimensions +
                ", totalSpent=" + totalSpent +
                ", totalImpressions=" + totalImpressions +
                ", totalClicks=" + totalClicks +
                ", recordCount=" + recordCount +
                '}';
    }
}
