package com.example.demo.model;

import java.util.UUID;

public class Account {
    private UUID id;
    private String email;
    private String passwordHash;
    private String createdAt;

    public Account(UUID id, String email, String passwordHash, String createdAt) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getCreatedAt() { return createdAt; }
}


