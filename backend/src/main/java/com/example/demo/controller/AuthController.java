package com.example.demo.controller;

import com.example.demo.model.Account;
import com.example.demo.security.JwtUtil;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final String adminEmail;

    public AuthController(AuthService authService, JwtUtil jwtUtil, @Value("${app.admin.email}") String adminEmail) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.adminEmail = adminEmail;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "").trim().toLowerCase();
        String password = body.getOrDefault("password", "");
        if (email.isEmpty() || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }
        return authService.findByEmail(email)
                .<ResponseEntity<?>>map(a -> ResponseEntity.status(409).body(Map.of("error", "Email already registered")))
                .orElseGet(() -> {
                    Account acc = authService.register(email, password);
                    String token = jwtUtil.generateToken(acc.getEmail(), acc.getId());
                    return ResponseEntity.ok(Map.of("token", token));
                });
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "").trim().toLowerCase();
        String password = body.getOrDefault("password", "");
        return authService.findByEmail(email)
                .filter(a -> authService.verifyPassword(password, a.getPasswordHash()))
                .<ResponseEntity<?>>map(a -> ResponseEntity.ok(Map.of("token", jwtUtil.generateToken(a.getEmail(), a.getId()))))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication auth) {
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();
        boolean isAdmin = adminEmail.equals(user.getEmail());
        return ResponseEntity.ok(Map.of(
            "email", user.getEmail(),
            "userId", user.getUserId().toString(),
            "isAdmin", isAdmin
        ));
    }
}


