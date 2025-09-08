package com.example.demo.controller;

import com.example.demo.model.Account;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
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
}


