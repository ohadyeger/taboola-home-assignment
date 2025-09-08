package com.example.demo.config;

import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupSeeder implements CommandLineRunner {

    private final AuthService authService;

    @Value("${app.admin.email:admin@example.com}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    public StartupSeeder(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void run(String... args) {
        authService.findByEmail(adminEmail.toLowerCase()).orElseGet(() -> {
            return authService.register(adminEmail.toLowerCase(), adminPassword);
        });
    }
}


