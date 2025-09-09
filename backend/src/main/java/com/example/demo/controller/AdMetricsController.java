package com.example.demo.controller;

import com.example.demo.model.AdMetrics;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AdMetricsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ads")
public class AdMetricsController {
    private final AdMetricsService adMetricsService;
    private final String adminEmail;

    public AdMetricsController(AdMetricsService adMetricsService, @Value("${app.admin.email}") String adminEmail) {
        this.adMetricsService = adMetricsService;
        this.adminEmail = adminEmail;
    }

    @GetMapping
    public List<AdMetrics> getAllMetrics() {
        return adMetricsService.getAllMetrics();
    }

    @GetMapping("/my")
    public List<AdMetrics> getMyMetrics(Authentication auth) {
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();
        UUID userId = user.getUserId();
        String userEmail = user.getEmail();
        
        // If user is admin, return all metrics; otherwise return only their own
        if (adminEmail.equals(userEmail)) {
            return adMetricsService.getAllMetrics();
        } else {
            return adMetricsService.getMetricsByAccountId(userId);
        }
    }

    @GetMapping("/countries")
    public ResponseEntity<List<String>> getAvailableCountries(Authentication auth) {
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();
        UUID userId = user.getUserId();
        String userEmail = user.getEmail();
        
        // If user is admin, return all countries; otherwise return only their own
        if (adminEmail.equals(userEmail)) {
            List<String> countries = adMetricsService.getAvailableCountries();
            return ResponseEntity.ok(countries);
        } else {
            List<String> countries = adMetricsService.getAvailableCountriesByAccountId(userId);
            return ResponseEntity.ok(countries);
        }
    }

    @GetMapping("/campaigns")
    public ResponseEntity<List<String>> getAvailableCampaigns(Authentication auth) {
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();
        UUID userId = user.getUserId();
        String userEmail = user.getEmail();
        
        // If user is admin, return all campaigns; otherwise return only their own
        if (adminEmail.equals(userEmail)) {
            List<String> campaigns = adMetricsService.getAvailableCampaigns();
            return ResponseEntity.ok(campaigns);
        } else {
            List<String> campaigns = adMetricsService.getAvailableCampaignsByAccountId(userId);
            return ResponseEntity.ok(campaigns);
        }
    }

    @GetMapping("/platforms")
    public ResponseEntity<List<String>> getAvailablePlatforms(Authentication auth) {
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();
        UUID userId = user.getUserId();
        String userEmail = user.getEmail();
        
        // If user is admin, return all platforms; otherwise return only their own
        if (adminEmail.equals(userEmail)) {
            List<String> platforms = adMetricsService.getAvailablePlatforms();
            return ResponseEntity.ok(platforms);
        } else {
            List<String> platforms = adMetricsService.getAvailablePlatformsByAccountId(userId);
            return ResponseEntity.ok(platforms);
        }
    }

    @GetMapping("/browsers")
    public ResponseEntity<List<String>> getAvailableBrowsers(Authentication auth) {
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();
        UUID userId = user.getUserId();
        String userEmail = user.getEmail();
        
        // If user is admin, return all browsers; otherwise return only their own
        if (adminEmail.equals(userEmail)) {
            List<String> browsers = adMetricsService.getAvailableBrowsers();
            return ResponseEntity.ok(browsers);
        } else {
            List<String> browsers = adMetricsService.getAvailableBrowsersByAccountId(userId);
            return ResponseEntity.ok(browsers);
        }
    }
}
