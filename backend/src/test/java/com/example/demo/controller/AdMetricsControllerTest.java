package com.example.demo.controller;

import com.example.demo.model.AdMetrics;
import com.example.demo.model.PaginatedResponse;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AdMetricsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdMetricsControllerTest {

    @Mock
    private AdMetricsService adMetricsService;

    @Mock
    private Authentication authentication;

    @Mock
    private UserPrincipal userPrincipal;

    private AdMetricsController controller;
    private final String adminEmail = "admin@test.com";

    @BeforeEach
    void setUp() {
        controller = new AdMetricsController(adMetricsService, adminEmail);
    }

    @Test
    void getAllMetrics_ShouldReturnAllMetrics() {
        // Arrange
        UUID accountId = UUID.randomUUID();
        AdMetrics expectedMetric = new AdMetrics(
                "2023-01-01", "2023-W01", "2023-01",
                accountId, "Campaign1", "US", "Desktop", "Chrome",
                new BigDecimal("100.50"), 1000L, 50L
        );
        List<AdMetrics> expectedMetrics = Arrays.asList(expectedMetric);

        when(adMetricsService.getAllMetrics()).thenReturn(expectedMetrics);

        // Act
        List<AdMetrics> result = controller.getAllMetrics();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(expectedMetric, result.get(0));
        verify(adMetricsService).getAllMetrics();
    }

    @Test
    void getMyMetrics_WhenUserIsAdmin_ShouldReturnAllMetrics() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String userEmail = adminEmail;
        AdMetrics expectedMetric = new AdMetrics(
                "2023-01-01", "2023-W01", "2023-01",
                userId, "Campaign1", "US", "Desktop", "Chrome",
                new BigDecimal("100.50"), 1000L, 50L
        );
        List<AdMetrics> expectedMetrics = Arrays.asList(expectedMetric);

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getUserId()).thenReturn(userId);
        when(userPrincipal.getEmail()).thenReturn(userEmail);
        when(adMetricsService.getAllMetrics()).thenReturn(expectedMetrics);

        // Act
        List<AdMetrics> result = controller.getMyMetrics(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(expectedMetric, result.get(0));
        verify(adMetricsService).getAllMetrics();
        verify(adMetricsService, never()).getMetricsByAccountId(any());
    }

    @Test
    void getMyMetrics_WhenUserIsNotAdmin_ShouldReturnUserSpecificMetrics() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String userEmail = "user@test.com";
        AdMetrics expectedMetric = new AdMetrics(
                "2023-01-01", "2023-W01", "2023-01",
                userId, "Campaign1", "US", "Desktop", "Chrome",
                new BigDecimal("100.50"), 1000L, 50L
        );
        List<AdMetrics> expectedMetrics = Arrays.asList(expectedMetric);

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getUserId()).thenReturn(userId);
        when(userPrincipal.getEmail()).thenReturn(userEmail);
        when(adMetricsService.getMetricsByAccountId(userId)).thenReturn(expectedMetrics);

        // Act
        List<AdMetrics> result = controller.getMyMetrics(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(expectedMetric, result.get(0));
        verify(adMetricsService).getMetricsByAccountId(userId);
        verify(adMetricsService, never()).getAllMetrics();
    }

    @Test
    void getMyMetricsPaginated_WhenUserIsAdmin_ShouldReturnAllMetricsPaginated() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String userEmail = adminEmail;
        int page = 0;
        int size = 10;
        AdMetrics expectedMetric = new AdMetrics(
                "2023-01-01", "2023-W01", "2023-01",
                userId, "Campaign1", "US", "Desktop", "Chrome",
                new BigDecimal("100.50"), 1000L, 50L
        );
        PaginatedResponse<AdMetrics> expectedResponse = new PaginatedResponse<>(
                Arrays.asList(expectedMetric), page, 1, 1L, size
        );

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getUserId()).thenReturn(userId);
        when(userPrincipal.getEmail()).thenReturn(userEmail);
        when(adMetricsService.getAllMetricsPaginated(page, size)).thenReturn(expectedResponse);

        // Act
        PaginatedResponse<AdMetrics> result = controller.getMyMetricsPaginated(authentication, page, size);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getData().size());
        assertEquals(page, result.getCurrentPage());
        assertEquals(1, result.getTotalPages());
        assertEquals(1L, result.getTotalElements());
        assertEquals(size, result.getPageSize());
        verify(adMetricsService).getAllMetricsPaginated(page, size);
        verify(adMetricsService, never()).getMetricsByAccountIdPaginated(any(), anyInt(), anyInt());
    }

    @Test
    void getMyMetricsPaginated_WhenUserIsNotAdmin_ShouldReturnUserSpecificMetricsPaginated() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String userEmail = "user@test.com";
        int page = 0;
        int size = 10;
        AdMetrics expectedMetric = new AdMetrics(
                "2023-01-01", "2023-W01", "2023-01",
                userId, "Campaign1", "US", "Desktop", "Chrome",
                new BigDecimal("100.50"), 1000L, 50L
        );
        PaginatedResponse<AdMetrics> expectedResponse = new PaginatedResponse<>(
                Arrays.asList(expectedMetric), page, 1, 1L, size
        );

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getUserId()).thenReturn(userId);
        when(userPrincipal.getEmail()).thenReturn(userEmail);
        when(adMetricsService.getMetricsByAccountIdPaginated(userId, page, size)).thenReturn(expectedResponse);

        // Act
        PaginatedResponse<AdMetrics> result = controller.getMyMetricsPaginated(authentication, page, size);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getData().size());
        assertEquals(page, result.getCurrentPage());
        assertEquals(1, result.getTotalPages());
        assertEquals(1L, result.getTotalElements());
        assertEquals(size, result.getPageSize());
        verify(adMetricsService).getMetricsByAccountIdPaginated(userId, page, size);
        verify(adMetricsService, never()).getAllMetricsPaginated(anyInt(), anyInt());
    }

    @Test
    void getAvailableCountries_WhenUserIsAdmin_ShouldReturnAllCountries() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String userEmail = adminEmail;
        List<String> expectedCountries = Arrays.asList("US", "UK", "CA");

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getUserId()).thenReturn(userId);
        when(userPrincipal.getEmail()).thenReturn(userEmail);
        when(adMetricsService.getAvailableCountries()).thenReturn(expectedCountries);

        // Act
        ResponseEntity<List<String>> result = controller.getAvailableCountries(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertNotNull(result.getBody());
        assertEquals(3, result.getBody().size());
        assertEquals(expectedCountries, result.getBody());
        verify(adMetricsService).getAvailableCountries();
        verify(adMetricsService, never()).getAvailableCountriesByAccountId(any());
    }

    @Test
    void getAvailableCountries_WhenUserIsNotAdmin_ShouldReturnUserSpecificCountries() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String userEmail = "user@test.com";
        List<String> expectedCountries = Arrays.asList("US", "UK");

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getUserId()).thenReturn(userId);
        when(userPrincipal.getEmail()).thenReturn(userEmail);
        when(adMetricsService.getAvailableCountriesByAccountId(userId)).thenReturn(expectedCountries);

        // Act
        ResponseEntity<List<String>> result = controller.getAvailableCountries(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertNotNull(result.getBody());
        assertEquals(2, result.getBody().size());
        assertEquals(expectedCountries, result.getBody());
        verify(adMetricsService).getAvailableCountriesByAccountId(userId);
        verify(adMetricsService, never()).getAvailableCountries();
    }

    @Test
    void getAvailableCampaigns_WhenUserIsAdmin_ShouldReturnAllCampaigns() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String userEmail = adminEmail;
        List<String> expectedCampaigns = Arrays.asList("Campaign1", "Campaign2");

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getUserId()).thenReturn(userId);
        when(userPrincipal.getEmail()).thenReturn(userEmail);
        when(adMetricsService.getAvailableCampaigns()).thenReturn(expectedCampaigns);

        // Act
        ResponseEntity<List<String>> result = controller.getAvailableCampaigns(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertNotNull(result.getBody());
        assertEquals(2, result.getBody().size());
        assertEquals(expectedCampaigns, result.getBody());
        verify(adMetricsService).getAvailableCampaigns();
        verify(adMetricsService, never()).getAvailableCampaignsByAccountId(any());
    }

    @Test
    void getAvailablePlatforms_WhenUserIsAdmin_ShouldReturnAllPlatforms() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String userEmail = adminEmail;
        List<String> expectedPlatforms = Arrays.asList("Desktop", "Mobile");

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getUserId()).thenReturn(userId);
        when(userPrincipal.getEmail()).thenReturn(userEmail);
        when(adMetricsService.getAvailablePlatforms()).thenReturn(expectedPlatforms);

        // Act
        ResponseEntity<List<String>> result = controller.getAvailablePlatforms(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertNotNull(result.getBody());
        assertEquals(2, result.getBody().size());
        assertEquals(expectedPlatforms, result.getBody());
        verify(adMetricsService).getAvailablePlatforms();
        verify(adMetricsService, never()).getAvailablePlatformsByAccountId(any());
    }

    @Test
    void getAvailableBrowsers_WhenUserIsAdmin_ShouldReturnAllBrowsers() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String userEmail = adminEmail;
        List<String> expectedBrowsers = Arrays.asList("Chrome", "Firefox", "Safari");

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getUserId()).thenReturn(userId);
        when(userPrincipal.getEmail()).thenReturn(userEmail);
        when(adMetricsService.getAvailableBrowsers()).thenReturn(expectedBrowsers);

        // Act
        ResponseEntity<List<String>> result = controller.getAvailableBrowsers(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertNotNull(result.getBody());
        assertEquals(3, result.getBody().size());
        assertEquals(expectedBrowsers, result.getBody());
        verify(adMetricsService).getAvailableBrowsers();
        verify(adMetricsService, never()).getAvailableBrowsersByAccountId(any());
    }
}
