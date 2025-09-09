package com.example.demo.config;

import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class StartupSeeder implements CommandLineRunner {

    private final AuthService authService;
    private final JdbcTemplate jdbcTemplate;

    @Value("${app.admin.email:admin@example.com}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    public StartupSeeder(AuthService authService, JdbcTemplate jdbcTemplate) {
        this.authService = authService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        // Load mock accounts from CSV first
        loadMockAccounts();
        
        // Create admin account (only if it doesn't exist)
        authService.findByEmail(adminEmail.toLowerCase()).orElseGet(() -> {
            return authService.register(adminEmail.toLowerCase(), adminPassword);
        });
        
        // Load mock ad metrics from CSV
        loadMockAdMetrics();
    }

    private void loadMockAccounts() {
        try {
            ClassPathResource resource = new ClassPathResource("mock_accounts.csv");
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));
            
            String line;
            boolean isFirstLine = true;
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }
                
                String[] values = line.split(",");
                if (values.length >= 3) {
                    String id = values[0].trim();
                    String email = values[1].trim();
                    String passwordHash = values[2].trim();
                    
                    // Check if account already exists
                    Integer count = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM appdb.accounts WHERE id = ?", 
                        Integer.class, 
                        UUID.fromString(id)
                    );
                    
                    if (count == 0) {
                        jdbcTemplate.update(
                            "INSERT INTO appdb.accounts (id, email, password_hash, created_at) VALUES (?, ?, ?, now())",
                            UUID.fromString(id), email, passwordHash
                        );
                    }
                }
            }
            reader.close();
        } catch (IOException e) {
            System.err.println("Error loading mock accounts: " + e.getMessage());
        }
    }

    private void loadMockAdMetrics() {
        try {
            ClassPathResource resource = new ClassPathResource("mock_ad_metrics.csv");
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));
            
            String line;
            boolean isFirstLine = true;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }
                
                String[] values = line.split(",");
                if (values.length >= 9) {
                    LocalDateTime eventTime = LocalDateTime.parse(values[0].trim(), formatter);
                    UUID accountId = UUID.fromString(values[1].trim());
                    String campaign = values[2].trim();
                    String country = values[3].trim();
                    String platform = values[4].trim();
                    String browser = values[5].trim();
                    BigDecimal spent = new BigDecimal(values[6].trim());
                    long impressions = Long.parseLong(values[7].trim());
                    long clicks = Long.parseLong(values[8].trim());
                    
                    // Insert ad metrics data
                    jdbcTemplate.update(
                        "INSERT INTO appdb.ads_metrics (event_time, account_id, campaign, country, platform, browser, spent, impressions, clicks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        eventTime, accountId, campaign, country, platform, browser, spent, impressions, clicks
                    );
                }
            }
            reader.close();
        } catch (IOException e) {
            System.err.println("Error loading mock ad metrics: " + e.getMessage());
        }
    }
}


