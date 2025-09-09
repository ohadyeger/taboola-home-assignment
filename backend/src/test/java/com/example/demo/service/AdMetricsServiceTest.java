package com.example.demo.service;

import com.example.demo.model.AdMetrics;
import com.example.demo.model.PaginatedResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdMetricsServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private ResultSet resultSet;

    private AdMetricsService adMetricsService;

    @BeforeEach
    void setUp() {
        adMetricsService = new AdMetricsService(jdbcTemplate);
    }

    @Test
    void getAllMetrics_ShouldReturnListOfMetrics() throws SQLException {
        // Arrange
        UUID accountId = UUID.randomUUID();
        AdMetrics expectedMetric = new AdMetrics(
                "2023-01-01", "2023-W01", "2023-01",
                accountId, "Campaign1", "US", "Desktop", "Chrome",
                new BigDecimal("100.50"), 1000L, 50L
        );

        when(jdbcTemplate.query(anyString(), any(RowMapper.class)))
                .thenReturn(Arrays.asList(expectedMetric));

        // Act
        List<AdMetrics> result = adMetricsService.getAllMetrics();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(expectedMetric, result.get(0));
        verify(jdbcTemplate).query(anyString(), any(RowMapper.class));
    }

    @Test
    void getAllMetricsPaginated_ShouldReturnPaginatedResponse() throws SQLException {
        // Arrange
        int page = 0;
        int size = 10;
        UUID accountId = UUID.randomUUID();
        AdMetrics expectedMetric = new AdMetrics(
                "2023-01-01", "2023-W01", "2023-01",
                accountId, "Campaign1", "US", "Desktop", "Chrome",
                new BigDecimal("100.50"), 1000L, 50L
        );

        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class)))
                .thenReturn(1L);
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(size), eq(0)))
                .thenReturn(Arrays.asList(expectedMetric));

        // Act
        PaginatedResponse<AdMetrics> result = adMetricsService.getAllMetricsPaginated(page, size);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getData().size());
        assertEquals(0, result.getCurrentPage());
        assertEquals(1, result.getTotalPages());
        assertEquals(1L, result.getTotalElements());
        assertEquals(size, result.getPageSize());
        verify(jdbcTemplate).queryForObject(anyString(), eq(Long.class));
        verify(jdbcTemplate).query(anyString(), any(RowMapper.class), eq(size), eq(0));
    }

    @Test
    void getMetricsByAccountId_ShouldReturnFilteredMetrics() throws SQLException {
        // Arrange
        UUID accountId = UUID.randomUUID();
        AdMetrics expectedMetric = new AdMetrics(
                "2023-01-01", "2023-W01", "2023-01",
                accountId, "Campaign1", "US", "Desktop", "Chrome",
                new BigDecimal("100.50"), 1000L, 50L
        );

        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(accountId)))
                .thenReturn(Arrays.asList(expectedMetric));

        // Act
        List<AdMetrics> result = adMetricsService.getMetricsByAccountId(accountId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(expectedMetric, result.get(0));
        verify(jdbcTemplate).query(anyString(), any(RowMapper.class), eq(accountId));
    }

    @Test
    void getMetricsByAccountIdPaginated_ShouldReturnPaginatedFilteredMetrics() throws SQLException {
        // Arrange
        UUID accountId = UUID.randomUUID();
        int page = 0;
        int size = 10;
        AdMetrics expectedMetric = new AdMetrics(
                "2023-01-01", "2023-W01", "2023-01",
                accountId, "Campaign1", "US", "Desktop", "Chrome",
                new BigDecimal("100.50"), 1000L, 50L
        );

        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class), eq(accountId)))
                .thenReturn(1L);
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(accountId), eq(size), eq(0)))
                .thenReturn(Arrays.asList(expectedMetric));

        // Act
        PaginatedResponse<AdMetrics> result = adMetricsService.getMetricsByAccountIdPaginated(accountId, page, size);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getData().size());
        assertEquals(0, result.getCurrentPage());
        assertEquals(1, result.getTotalPages());
        assertEquals(1L, result.getTotalElements());
        assertEquals(size, result.getPageSize());
        verify(jdbcTemplate).queryForObject(anyString(), eq(Long.class), eq(accountId));
        verify(jdbcTemplate).query(anyString(), any(RowMapper.class), eq(accountId), eq(size), eq(0));
    }

    @Test
    void getAvailableCountries_ShouldReturnListOfCountries() {
        // Arrange
        List<String> expectedCountries = Arrays.asList("US", "UK", "CA");

        when(jdbcTemplate.queryForList(anyString(), eq(String.class)))
                .thenReturn(expectedCountries);

        // Act
        List<String> result = adMetricsService.getAvailableCountries();

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(expectedCountries, result);
        verify(jdbcTemplate).queryForList(anyString(), eq(String.class));
    }

    @Test
    void getAvailableCountriesByAccountId_ShouldReturnFilteredCountries() {
        // Arrange
        UUID accountId = UUID.randomUUID();
        List<String> expectedCountries = Arrays.asList("US", "UK");

        when(jdbcTemplate.queryForList(anyString(), eq(String.class), eq(accountId)))
                .thenReturn(expectedCountries);

        // Act
        List<String> result = adMetricsService.getAvailableCountriesByAccountId(accountId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedCountries, result);
        verify(jdbcTemplate).queryForList(anyString(), eq(String.class), eq(accountId));
    }

    @Test
    void getAvailableCampaigns_ShouldReturnListOfCampaigns() {
        // Arrange
        List<String> expectedCampaigns = Arrays.asList("Campaign1", "Campaign2");

        when(jdbcTemplate.queryForList(anyString(), eq(String.class)))
                .thenReturn(expectedCampaigns);

        // Act
        List<String> result = adMetricsService.getAvailableCampaigns();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedCampaigns, result);
        verify(jdbcTemplate).queryForList(anyString(), eq(String.class));
    }

    @Test
    void getAvailablePlatforms_ShouldReturnListOfPlatforms() {
        // Arrange
        List<String> expectedPlatforms = Arrays.asList("Desktop", "Mobile");

        when(jdbcTemplate.queryForList(anyString(), eq(String.class)))
                .thenReturn(expectedPlatforms);

        // Act
        List<String> result = adMetricsService.getAvailablePlatforms();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedPlatforms, result);
        verify(jdbcTemplate).queryForList(anyString(), eq(String.class));
    }

    @Test
    void getAvailableBrowsers_ShouldReturnListOfBrowsers() {
        // Arrange
        List<String> expectedBrowsers = Arrays.asList("Chrome", "Firefox", "Safari");

        when(jdbcTemplate.queryForList(anyString(), eq(String.class)))
                .thenReturn(expectedBrowsers);

        // Act
        List<String> result = adMetricsService.getAvailableBrowsers();

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(expectedBrowsers, result);
        verify(jdbcTemplate).queryForList(anyString(), eq(String.class));
    }
}
