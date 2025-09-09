package com.example.demo.controller;

import com.example.demo.model.Account;
import com.example.demo.security.JwtUtil;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private Authentication authentication;

    @Mock
    private UserPrincipal userPrincipal;

    private AuthController controller;
    private final String adminEmail = "admin@test.com";

    @BeforeEach
    void setUp() {
        controller = new AuthController(authService, jwtUtil, adminEmail);
    }

    @Test
    void register_WithValidData_ShouldReturnToken() {
        // Arrange
        String email = "test@example.com";
        String password = "password123";
        String token = "jwt-token";
        UUID userId = UUID.randomUUID();
        Account account = new Account(userId, email, "hashedPassword", "");

        Map<String, String> requestBody = Map.of("email", email, "password", password);

        when(authService.findByEmail(email)).thenReturn(Optional.empty());
        when(authService.register(email, password)).thenReturn(account);
        when(jwtUtil.generateToken(email, userId)).thenReturn(token);

        // Act
        ResponseEntity<?> result = controller.register(requestBody);

        // Assert
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertTrue(result.getBody() instanceof Map);
        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) result.getBody();
        assertEquals(token, responseBody.get("token"));
        verify(authService).findByEmail(email);
        verify(authService).register(email, password);
        verify(jwtUtil).generateToken(email, userId);
    }

    @Test
    void register_WithExistingEmail_ShouldReturnConflict() {
        // Arrange
        String email = "existing@example.com";
        String password = "password123";
        UUID userId = UUID.randomUUID();
        Account existingAccount = new Account(userId, email, "hashedPassword", "");

        Map<String, String> requestBody = Map.of("email", email, "password", password);

        when(authService.findByEmail(email)).thenReturn(Optional.of(existingAccount));

        // Act
        ResponseEntity<?> result = controller.register(requestBody);

        // Assert
        assertNotNull(result);
        assertEquals(409, result.getStatusCodeValue());
        assertTrue(result.getBody() instanceof Map);
        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) result.getBody();
        assertEquals("Email already registered", responseBody.get("error"));
        verify(authService).findByEmail(email);
        verify(authService, never()).register(any(), any());
        verify(jwtUtil, never()).generateToken(any(), any());
    }

    @Test
    void register_WithEmptyEmail_ShouldReturnBadRequest() {
        // Arrange
        Map<String, String> requestBody = Map.of("email", "", "password", "password123");

        // Act
        ResponseEntity<?> result = controller.register(requestBody);

        // Assert
        assertNotNull(result);
        assertEquals(400, result.getStatusCodeValue());
        assertTrue(result.getBody() instanceof Map);
        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) result.getBody();
        assertEquals("Email and password are required", responseBody.get("error"));
        verify(authService, never()).findByEmail(any());
        verify(authService, never()).register(any(), any());
    }

    @Test
    void register_WithEmptyPassword_ShouldReturnBadRequest() {
        // Arrange
        Map<String, String> requestBody = Map.of("email", "test@example.com", "password", "");

        // Act
        ResponseEntity<?> result = controller.register(requestBody);

        // Assert
        assertNotNull(result);
        assertEquals(400, result.getStatusCodeValue());
        assertTrue(result.getBody() instanceof Map);
        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) result.getBody();
        assertEquals("Email and password are required", responseBody.get("error"));
        verify(authService, never()).findByEmail(any());
        verify(authService, never()).register(any(), any());
    }

    @Test
    void login_WithValidCredentials_ShouldReturnToken() {
        // Arrange
        String email = "test@example.com";
        String password = "password123";
        String token = "jwt-token";
        UUID userId = UUID.randomUUID();
        Account account = new Account(userId, email, "hashedPassword", "");

        Map<String, String> requestBody = Map.of("email", email, "password", password);

        when(authService.findByEmail(email)).thenReturn(Optional.of(account));
        when(authService.verifyPassword(password, account.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateToken(email, userId)).thenReturn(token);

        // Act
        ResponseEntity<?> result = controller.login(requestBody);

        // Assert
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertTrue(result.getBody() instanceof Map);
        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) result.getBody();
        assertEquals(token, responseBody.get("token"));
        verify(authService).findByEmail(email);
        verify(authService).verifyPassword(password, account.getPasswordHash());
        verify(jwtUtil).generateToken(email, userId);
    }

    @Test
    void login_WithInvalidPassword_ShouldReturnUnauthorized() {
        // Arrange
        String email = "test@example.com";
        String password = "wrongpassword";
        UUID userId = UUID.randomUUID();
        Account account = new Account(userId, email, "hashedPassword", "");

        Map<String, String> requestBody = Map.of("email", email, "password", password);

        when(authService.findByEmail(email)).thenReturn(Optional.of(account));
        when(authService.verifyPassword(password, account.getPasswordHash())).thenReturn(false);

        // Act
        ResponseEntity<?> result = controller.login(requestBody);

        // Assert
        assertNotNull(result);
        assertEquals(401, result.getStatusCodeValue());
        assertTrue(result.getBody() instanceof Map);
        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) result.getBody();
        assertEquals("Invalid credentials", responseBody.get("error"));
        verify(authService).findByEmail(email);
        verify(authService).verifyPassword(password, account.getPasswordHash());
        verify(jwtUtil, never()).generateToken(any(), any());
    }

    @Test
    void login_WithNonExistentEmail_ShouldReturnUnauthorized() {
        // Arrange
        String email = "nonexistent@example.com";
        String password = "password123";

        Map<String, String> requestBody = Map.of("email", email, "password", password);

        when(authService.findByEmail(email)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> result = controller.login(requestBody);

        // Assert
        assertNotNull(result);
        assertEquals(401, result.getStatusCodeValue());
        assertTrue(result.getBody() instanceof Map);
        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) result.getBody();
        assertEquals("Invalid credentials", responseBody.get("error"));
        verify(authService).findByEmail(email);
        verify(authService, never()).verifyPassword(any(), any());
        verify(jwtUtil, never()).generateToken(any(), any());
    }

    @Test
    void getCurrentUser_WhenUserIsAdmin_ShouldReturnUserInfoWithAdminFlag() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String userEmail = adminEmail;

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getEmail()).thenReturn(userEmail);
        when(userPrincipal.getUserId()).thenReturn(userId);

        // Act
        ResponseEntity<?> result = controller.getCurrentUser(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertTrue(result.getBody() instanceof Map);
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) result.getBody();
        assertEquals(userEmail, responseBody.get("email"));
        assertEquals(userId.toString(), responseBody.get("userId"));
        assertEquals(true, responseBody.get("isAdmin"));
    }

    @Test
    void getCurrentUser_WhenUserIsNotAdmin_ShouldReturnUserInfoWithoutAdminFlag() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String userEmail = "user@test.com";

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getEmail()).thenReturn(userEmail);
        when(userPrincipal.getUserId()).thenReturn(userId);

        // Act
        ResponseEntity<?> result = controller.getCurrentUser(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertTrue(result.getBody() instanceof Map);
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) result.getBody();
        assertEquals(userEmail, responseBody.get("email"));
        assertEquals(userId.toString(), responseBody.get("userId"));
        assertEquals(false, responseBody.get("isAdmin"));
    }

    @Test
    void register_WithEmailCaseInsensitive_ShouldNormalizeEmail() {
        // Arrange
        String email = "TEST@EXAMPLE.COM";
        String normalizedEmail = "test@example.com";
        String password = "password123";
        String token = "jwt-token";
        UUID userId = UUID.randomUUID();
        Account account = new Account(userId, normalizedEmail, "hashedPassword", "");

        Map<String, String> requestBody = Map.of("email", email, "password", password);

        when(authService.findByEmail(normalizedEmail)).thenReturn(Optional.empty());
        when(authService.register(normalizedEmail, password)).thenReturn(account);
        when(jwtUtil.generateToken(normalizedEmail, userId)).thenReturn(token);

        // Act
        ResponseEntity<?> result = controller.register(requestBody);

        // Assert
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        verify(authService).findByEmail(normalizedEmail);
        verify(authService).register(normalizedEmail, password);
        verify(jwtUtil).generateToken(normalizedEmail, userId);
    }
}
