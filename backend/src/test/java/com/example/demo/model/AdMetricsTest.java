package com.example.demo.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class AdMetricsTest {

    @Test
    void constructor_WithValidData_ShouldCreateInstance() {
        // Arrange
        String day = "2023-01-01";
        String week = "2023-W01";
        String month = "2023-01";
        UUID accountId = UUID.randomUUID();
        String campaign = "Campaign1";
        String country = "US";
        String platform = "Desktop";
        String browser = "Chrome";
        BigDecimal spent = new BigDecimal("100.50");
        Long impressions = 1000L;
        Long clicks = 50L;

        // Act
        AdMetrics adMetrics = new AdMetrics(day, week, month, accountId, campaign, country, platform, browser, spent, impressions, clicks);

        // Assert
        assertNotNull(adMetrics);
        assertEquals(day, adMetrics.getDay());
        assertEquals(week, adMetrics.getWeek());
        assertEquals(month, adMetrics.getMonth());
        assertEquals(accountId, adMetrics.getAccountId());
        assertEquals(campaign, adMetrics.getCampaign());
        assertEquals(country, adMetrics.getCountry());
        assertEquals(platform, adMetrics.getPlatform());
        assertEquals(browser, adMetrics.getBrowser());
        assertEquals(spent, adMetrics.getSpent());
        assertEquals(impressions, adMetrics.getImpressions());
        assertEquals(clicks, adMetrics.getClicks());
    }

    @Test
    void constructor_WithNullValues_ShouldCreateInstance() {
        // Arrange
        String day = null;
        String week = null;
        String month = null;
        UUID accountId = null;
        String campaign = null;
        String country = null;
        String platform = null;
        String browser = null;
        BigDecimal spent = null;
        Long impressions = null;
        Long clicks = null;

        // Act
        AdMetrics adMetrics = new AdMetrics(day, week, month, accountId, campaign, country, platform, browser, spent, impressions, clicks);

        // Assert
        assertNotNull(adMetrics);
        assertNull(adMetrics.getDay());
        assertNull(adMetrics.getWeek());
        assertNull(adMetrics.getMonth());
        assertNull(adMetrics.getAccountId());
        assertNull(adMetrics.getCampaign());
        assertNull(adMetrics.getCountry());
        assertNull(adMetrics.getPlatform());
        assertNull(adMetrics.getBrowser());
        assertNull(adMetrics.getSpent());
        assertNull(adMetrics.getImpressions());
        assertNull(adMetrics.getClicks());
    }

    @Test
    void equals_WithSameData_ShouldReturnTrue() {
        // Arrange
        UUID accountId = UUID.randomUUID();
        AdMetrics adMetrics1 = new AdMetrics("2023-01-01", "2023-W01", "2023-01", accountId, "Campaign1", "US", "Desktop", "Chrome", new BigDecimal("100.50"), 1000L, 50L);
        AdMetrics adMetrics2 = new AdMetrics("2023-01-01", "2023-W01", "2023-01", accountId, "Campaign1", "US", "Desktop", "Chrome", new BigDecimal("100.50"), 1000L, 50L);

        // Act & Assert
        assertEquals(adMetrics1, adMetrics2);
    }

    @Test
    void equals_WithDifferentData_ShouldReturnFalse() {
        // Arrange
        UUID accountId1 = UUID.randomUUID();
        UUID accountId2 = UUID.randomUUID();
        AdMetrics adMetrics1 = new AdMetrics("2023-01-01", "2023-W01", "2023-01", accountId1, "Campaign1", "US", "Desktop", "Chrome", new BigDecimal("100.50"), 1000L, 50L);
        AdMetrics adMetrics2 = new AdMetrics("2023-01-01", "2023-W01", "2023-01", accountId2, "Campaign1", "US", "Desktop", "Chrome", new BigDecimal("100.50"), 1000L, 50L);

        // Act & Assert
        assertNotEquals(adMetrics1, adMetrics2);
    }

    @Test
    void hashCode_WithSameData_ShouldReturnSameHashCode() {
        // Arrange
        UUID accountId = UUID.randomUUID();
        AdMetrics adMetrics1 = new AdMetrics("2023-01-01", "2023-W01", "2023-01", accountId, "Campaign1", "US", "Desktop", "Chrome", new BigDecimal("100.50"), 1000L, 50L);
        AdMetrics adMetrics2 = new AdMetrics("2023-01-01", "2023-W01", "2023-01", accountId, "Campaign1", "US", "Desktop", "Chrome", new BigDecimal("100.50"), 1000L, 50L);

        // Act & Assert
        assertEquals(adMetrics1.hashCode(), adMetrics2.hashCode());
    }

    @Test
    void toString_ShouldReturnStringRepresentation() {
        // Arrange
        UUID accountId = UUID.randomUUID();
        AdMetrics adMetrics = new AdMetrics("2023-01-01", "2023-W01", "2023-01", accountId, "Campaign1", "US", "Desktop", "Chrome", new BigDecimal("100.50"), 1000L, 50L);

        // Act
        String result = adMetrics.toString();

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("2023-01-01"));
        assertTrue(result.contains("Campaign1"));
        assertTrue(result.contains("US"));
    }
}
