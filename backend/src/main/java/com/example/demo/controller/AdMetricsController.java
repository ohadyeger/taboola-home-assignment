package com.example.demo.controller;

import com.example.demo.model.AdMetrics;
import com.example.demo.service.AdMetricsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
        String userEmail = auth.getName();
        
        // If user is admin, return all metrics; otherwise return only their own
        if (adminEmail.equals(userEmail)) {
            return adMetricsService.getAllMetrics();
        } else {
            return adMetricsService.getMetricsByAccount(userEmail);
        }
    }
}
