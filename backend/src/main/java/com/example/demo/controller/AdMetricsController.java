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
}
