package com.example.demo.service;

import com.example.demo.model.Account;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ResultSet resultSet;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(jdbcTemplate, passwordEncoder);
    }

    @Test
    void findByEmail_WhenUserExists_ShouldReturnAccount() throws SQLException {
        // Arrange
        String email = "test@example.com";
        UUID userId = UUID.randomUUID();
        String passwordHash = "hashedPassword";
        String createdAt = "2023-01-01";

        when(jdbcTemplate.query(anyString(), any(ResultSetExtractor.class), eq(email)))
                .thenAnswer(invocation -> Optional.of(new Account(userId, email, passwordHash, createdAt)));

        // Act
        Optional<Account> result = authService.findByEmail(email);

        // Assert
        assertTrue(result.isPresent());
        Account account = result.get();
        assertEquals(userId, account.getId());
        assertEquals(email, account.getEmail());
        assertEquals(passwordHash, account.getPasswordHash());
        assertEquals(createdAt, account.getCreatedAt());
    }

    @Test
    void findByEmail_WhenUserDoesNotExist_ShouldReturnEmpty() {
        // Arrange
        String email = "nonexistent@example.com";

        when(jdbcTemplate.query(anyString(), any(ResultSetExtractor.class), eq(email)))
                .thenReturn(Optional.empty());

        // Act
        Optional<Account> result = authService.findByEmail(email);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void register_ShouldCreateNewAccount() {
        // Arrange
        String email = "newuser@example.com";
        String rawPassword = "password123";
        String hashedPassword = "hashedPassword123";
        UUID generatedId = UUID.randomUUID();

        when(passwordEncoder.encode(rawPassword)).thenReturn(hashedPassword);
        when(jdbcTemplate.update(anyString(), anyString(), eq(email), eq(hashedPassword)))
                .thenReturn(1);

        // Act
        Account result = authService.register(email, rawPassword);

        // Assert
        assertNotNull(result);
        assertEquals(email, result.getEmail());
        assertEquals(hashedPassword, result.getPasswordHash());
        assertNotNull(result.getId());
        verify(passwordEncoder).encode(rawPassword);
        verify(jdbcTemplate).update(anyString(), anyString(), eq(email), eq(hashedPassword));
    }

    @Test
    void verifyPassword_WhenPasswordMatches_ShouldReturnTrue() {
        // Arrange
        String rawPassword = "password123";
        String hash = "hashedPassword123";

        when(passwordEncoder.matches(rawPassword, hash)).thenReturn(true);

        // Act
        boolean result = authService.verifyPassword(rawPassword, hash);

        // Assert
        assertTrue(result);
        verify(passwordEncoder).matches(rawPassword, hash);
    }

    @Test
    void verifyPassword_WhenPasswordDoesNotMatch_ShouldReturnFalse() {
        // Arrange
        String rawPassword = "password123";
        String hash = "hashedPassword123";

        when(passwordEncoder.matches(rawPassword, hash)).thenReturn(false);

        // Act
        boolean result = authService.verifyPassword(rawPassword, hash);

        // Assert
        assertFalse(result);
        verify(passwordEncoder).matches(rawPassword, hash);
    }
}
