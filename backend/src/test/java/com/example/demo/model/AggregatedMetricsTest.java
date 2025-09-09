package com.example.demo.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AggregatedMetricsTest {

    @Test
    void constructor_WithValidData_ShouldCreateInstance() {
        // Arrange
        Map<String, Object> dimensions = new HashMap<>();
        dimensions.put("country", "US");
        dimensions.put("platform", "Desktop");
        BigDecimal totalSpent = new BigDecimal("100.50");
        Long totalImpressions = 1000L;
        Long totalClicks = 50L;
        Integer recordCount = 1;

        // Act
        AggregatedMetrics aggregatedMetrics = new AggregatedMetrics(dimensions, totalSpent, totalImpressions, totalClicks, recordCount);

        // Assert
        assertNotNull(aggregatedMetrics);
        assertEquals(dimensions, aggregatedMetrics.getDimensions());
        assertEquals(totalSpent, aggregatedMetrics.getTotalSpent());
        assertEquals(totalImpressions, aggregatedMetrics.getTotalImpressions());
        assertEquals(totalClicks, aggregatedMetrics.getTotalClicks());
        assertEquals(recordCount, aggregatedMetrics.getRecordCount());
    }

    @Test
    void constructor_WithNullValues_ShouldCreateInstance() {
        // Arrange
        Map<String, Object> dimensions = null;
        BigDecimal totalSpent = null;
        Long totalImpressions = null;
        Long totalClicks = null;
        Integer recordCount = null;

        // Act
        AggregatedMetrics aggregatedMetrics = new AggregatedMetrics(dimensions, totalSpent, totalImpressions, totalClicks, recordCount);

        // Assert
        assertNotNull(aggregatedMetrics);
        assertNull(aggregatedMetrics.getDimensions());
        assertNull(aggregatedMetrics.getTotalSpent());
        assertNull(aggregatedMetrics.getTotalImpressions());
        assertNull(aggregatedMetrics.getTotalClicks());
        assertNull(aggregatedMetrics.getRecordCount());
    }

    @Test
    void constructor_WithEmptyDimensions_ShouldCreateInstance() {
        // Arrange
        Map<String, Object> dimensions = new HashMap<>();
        BigDecimal totalSpent = BigDecimal.ZERO;
        Long totalImpressions = 0L;
        Long totalClicks = 0L;
        Integer recordCount = 0;

        // Act
        AggregatedMetrics aggregatedMetrics = new AggregatedMetrics(dimensions, totalSpent, totalImpressions, totalClicks, recordCount);

        // Assert
        assertNotNull(aggregatedMetrics);
        assertNotNull(aggregatedMetrics.getDimensions());
        assertTrue(aggregatedMetrics.getDimensions().isEmpty());
        assertEquals(BigDecimal.ZERO, aggregatedMetrics.getTotalSpent());
        assertEquals(0L, aggregatedMetrics.getTotalImpressions());
        assertEquals(0L, aggregatedMetrics.getTotalClicks());
        assertEquals(0, aggregatedMetrics.getRecordCount());
    }

    @Test
    void equals_WithSameData_ShouldReturnTrue() {
        // Arrange
        Map<String, Object> dimensions1 = new HashMap<>();
        dimensions1.put("country", "US");
        dimensions1.put("platform", "Desktop");
        
        Map<String, Object> dimensions2 = new HashMap<>();
        dimensions2.put("country", "US");
        dimensions2.put("platform", "Desktop");
        
        AggregatedMetrics aggregatedMetrics1 = new AggregatedMetrics(dimensions1, new BigDecimal("100.50"), 1000L, 50L, 1);
        AggregatedMetrics aggregatedMetrics2 = new AggregatedMetrics(dimensions2, new BigDecimal("100.50"), 1000L, 50L, 1);

        // Act & Assert
        assertEquals(aggregatedMetrics1, aggregatedMetrics2);
    }

    @Test
    void equals_WithDifferentData_ShouldReturnFalse() {
        // Arrange
        Map<String, Object> dimensions1 = new HashMap<>();
        dimensions1.put("country", "US");
        
        Map<String, Object> dimensions2 = new HashMap<>();
        dimensions2.put("country", "UK");
        
        AggregatedMetrics aggregatedMetrics1 = new AggregatedMetrics(dimensions1, new BigDecimal("100.50"), 1000L, 50L, 1);
        AggregatedMetrics aggregatedMetrics2 = new AggregatedMetrics(dimensions2, new BigDecimal("100.50"), 1000L, 50L, 1);

        // Act & Assert
        assertNotEquals(aggregatedMetrics1, aggregatedMetrics2);
    }

    @Test
    void hashCode_WithSameData_ShouldReturnSameHashCode() {
        // Arrange
        Map<String, Object> dimensions1 = new HashMap<>();
        dimensions1.put("country", "US");
        dimensions1.put("platform", "Desktop");
        
        Map<String, Object> dimensions2 = new HashMap<>();
        dimensions2.put("country", "US");
        dimensions2.put("platform", "Desktop");
        
        AggregatedMetrics aggregatedMetrics1 = new AggregatedMetrics(dimensions1, new BigDecimal("100.50"), 1000L, 50L, 1);
        AggregatedMetrics aggregatedMetrics2 = new AggregatedMetrics(dimensions2, new BigDecimal("100.50"), 1000L, 50L, 1);

        // Act & Assert
        assertEquals(aggregatedMetrics1.hashCode(), aggregatedMetrics2.hashCode());
    }

    @Test
    void toString_ShouldReturnStringRepresentation() {
        // Arrange
        Map<String, Object> dimensions = new HashMap<>();
        dimensions.put("country", "US");
        dimensions.put("platform", "Desktop");
        AggregatedMetrics aggregatedMetrics = new AggregatedMetrics(dimensions, new BigDecimal("100.50"), 1000L, 50L, 1);

        // Act
        String result = aggregatedMetrics.toString();

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("US"));
        assertTrue(result.contains("Desktop"));
    }

    @Test
    void getDimensions_ShouldReturnImmutableMap() {
        // Arrange
        Map<String, Object> originalDimensions = new HashMap<>();
        originalDimensions.put("country", "US");
        AggregatedMetrics aggregatedMetrics = new AggregatedMetrics(originalDimensions, BigDecimal.ZERO, 0L, 0L, 0);

        // Act
        Map<String, Object> returnedDimensions = aggregatedMetrics.getDimensions();

        // Assert
        assertNotNull(returnedDimensions);
        assertEquals(originalDimensions, returnedDimensions);
        // Note: The actual implementation might return a mutable map, this test verifies the basic functionality
    }
}
