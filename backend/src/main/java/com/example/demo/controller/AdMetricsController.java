package com.example.demo.controller;

import com.example.demo.model.AdMetrics;
import com.example.demo.service.AdMetricsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ads")
public class AdMetricsController {
    private final AdMetricsService adMetricsService;

    public AdMetricsController(AdMetricsService adMetricsService) {
        this.adMetricsService = adMetricsService;
    }

    @GetMapping
    public List<AdMetrics> getAllMetrics() {
        return adMetricsService.getAllMetrics();
    }

    @GetMapping("/my")
    public List<AdMetrics> getMyMetrics(Authentication auth) {
        String userEmail = auth.getName();
        return adMetricsService.getMetricsByAccount(userEmail);
    }
}
