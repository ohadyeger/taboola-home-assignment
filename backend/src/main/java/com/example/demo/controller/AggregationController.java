package com.example.demo.controller;

import com.example.demo.model.AggregatedMetrics;
import com.example.demo.model.PaginatedResponse;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AggregationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/aggregate")
public class AggregationController {
    private final AggregationService aggregationService;
    private final String adminEmail;

    public AggregationController(AggregationService aggregationService, @Value("${app.admin.email}") String adminEmail) {
        this.aggregationService = aggregationService;
        this.adminEmail = adminEmail;
    }

    @PostMapping
    public ResponseEntity<?> getAggregatedData(@RequestBody Map<String, Object> request, Authentication auth) {
        try {
            UserPrincipal user = (UserPrincipal) auth.getPrincipal();
            UUID userId = user.getUserId();
            String userEmail = user.getEmail();
            
            // Extract parameters from request
            @SuppressWarnings("unchecked")
            List<String> groupByDimensions = (List<String>) request.getOrDefault("groupBy", List.of());
            @SuppressWarnings("unchecked")
            List<String> metrics = (List<String>) request.getOrDefault("metrics", List.of("spent", "impressions", "clicks"));
            String countryFilter = (String) request.getOrDefault("countryFilter", "All");
            String campaignFilter = (String) request.getOrDefault("campaignFilter", "All");
            String platformFilter = (String) request.getOrDefault("platformFilter", "All");
            String browserFilter = (String) request.getOrDefault("browserFilter", "All");
            String sortBy = (String) request.getOrDefault("sortBy", "");
            String sortDirection = (String) request.getOrDefault("sortDirection", "asc");
            
            // Validate metrics
            List<String> validMetrics = metrics.stream()
                .filter(m -> List.of("spent", "impressions", "clicks").contains(m))
                .collect(java.util.stream.Collectors.toList());
            
            if (validMetrics.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "At least one valid metric must be specified"));
            }
            
            // Check if user is admin
            boolean isAdmin = adminEmail.equals(userEmail);
            
            // Get aggregated data
            List<AggregatedMetrics> result = aggregationService.getAggregatedData(
                userId, groupByDimensions, validMetrics, countryFilter, campaignFilter, platformFilter, browserFilter, isAdmin, sortBy, sortDirection
            );
            
            return ResponseEntity.ok(Map.of(
                "data", result,
                "groupBy", groupByDimensions,
                "metrics", validMetrics,
                "countryFilter", countryFilter,
                "campaignFilter", campaignFilter,
                "platformFilter", platformFilter,
                "browserFilter", browserFilter,
                "isAdmin", isAdmin
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request: " + e.getMessage()));
        }
    }

    @GetMapping("/dimensions")
    public ResponseEntity<?> getAvailableDimensions() {
        return ResponseEntity.ok(Map.of(
            "dimensions", List.of("day", "week", "month", "campaign", "country", "platform", "browser"),
            "metrics", List.of("spent", "impressions", "clicks")
        ));
    }

    @PostMapping("/paginated")
    public ResponseEntity<?> getAggregatedMetricsPaginated(@RequestBody Map<String, Object> request, Authentication auth) {
        try {
            UserPrincipal user = (UserPrincipal) auth.getPrincipal();
            UUID userId = user.getUserId();
            String userEmail = user.getEmail();
            
            // Extract parameters from request
            @SuppressWarnings("unchecked")
            List<String> groupByDimensions = (List<String>) request.getOrDefault("groupBy", List.of());
            @SuppressWarnings("unchecked")
            List<String> metrics = (List<String>) request.getOrDefault("metrics", List.of("spent", "impressions", "clicks"));
            String countryFilter = (String) request.getOrDefault("countryFilter", "All");
            String campaignFilter = (String) request.getOrDefault("campaignFilter", "All");
            String platformFilter = (String) request.getOrDefault("platformFilter", "All");
            String browserFilter = (String) request.getOrDefault("browserFilter", "All");
            int page = (Integer) request.getOrDefault("page", 0);
            int size = (Integer) request.getOrDefault("size", 10);
            String sortBy = (String) request.getOrDefault("sortBy", "");
            String sortDirection = (String) request.getOrDefault("sortDirection", "asc");
            
            // Validate metrics
            List<String> validMetrics = metrics.stream()
                .filter(m -> List.of("spent", "impressions", "clicks").contains(m))
                .collect(java.util.stream.Collectors.toList());
            
            if (validMetrics.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "At least one valid metric must be selected"));
            }
            
            // Check if user is admin
            boolean isAdmin = adminEmail.equals(userEmail);
            
            // Get paginated aggregated data
            PaginatedResponse<AggregatedMetrics> result = aggregationService.getAggregatedDataPaginated(
                userId, groupByDimensions, validMetrics, countryFilter, campaignFilter, platformFilter, browserFilter, isAdmin, page, size, sortBy, sortDirection
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("data", result.getData());
            response.put("currentPage", result.getCurrentPage());
            response.put("totalPages", result.getTotalPages());
            response.put("totalElements", result.getTotalElements());
            response.put("pageSize", result.getPageSize());
            response.put("hasNext", result.isHasNext());
            response.put("hasPrevious", result.isHasPrevious());
            response.put("groupBy", groupByDimensions);
            response.put("metrics", validMetrics);
            response.put("countryFilter", countryFilter);
            response.put("campaignFilter", campaignFilter);
            response.put("platformFilter", platformFilter);
            response.put("browserFilter", browserFilter);
            response.put("isAdmin", isAdmin);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request: " + e.getMessage()));
        }
    }
}
