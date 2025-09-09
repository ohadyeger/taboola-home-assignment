package com.example.demo.controller;

import com.example.demo.model.AggregatedMetrics;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AggregationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
                userId, groupByDimensions, validMetrics, countryFilter, campaignFilter, platformFilter, isAdmin
            );
            
            return ResponseEntity.ok(Map.of(
                "data", result,
                "groupBy", groupByDimensions,
                "metrics", validMetrics,
                "countryFilter", countryFilter,
                "campaignFilter", campaignFilter,
                "platformFilter", platformFilter,
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
}
