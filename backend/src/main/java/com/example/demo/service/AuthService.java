package com.example.demo.service;

import com.example.demo.model.Account;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public AuthService(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<Account> findByEmail(String email) {
        return jdbcTemplate.query("SELECT id, email, password_hash, toString(created_at) created_at FROM appdb.accounts WHERE email = ? LIMIT 1",
                rs -> rs.next() ? Optional.of(new Account(
                        UUID.fromString(rs.getString("id")),
                        rs.getString("email"),
                        rs.getString("password_hash"),
                        rs.getString("created_at")
                )) : Optional.empty(), email);
    }

    public Account register(String email, String rawPassword) {
        String hash = passwordEncoder.encode(rawPassword);
        UUID id = UUID.randomUUID();
        jdbcTemplate.update("INSERT INTO appdb.accounts (id, email, password_hash) VALUES (?, ?, ?)", id.toString(), email, hash);
        return new Account(id, email, hash, "");
    }

    public boolean verifyPassword(String rawPassword, String hash) {
        return passwordEncoder.matches(rawPassword, hash);
    }
}


