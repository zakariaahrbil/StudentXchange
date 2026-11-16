package com.example.backend.services;

import com.example.backend.entities.Role;
import com.example.backend.entities.User;
import com.example.backend.payloads.auth.LoginPayload;
import com.example.backend.repositories.UserRepository;
import com.example.backend.security.JwtService;
import com.example.backend.services.impl.AuthenticationServiceImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Claims claims;

    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        authenticationService = new AuthenticationServiceImpl(
                authenticationManager,
                jwtService,
                userRepository
        );
    }

    @Test
    void loginNormalizesEmailAndReturnsAccessAndRefreshTokens() {
        UUID userId = UUID.randomUUID();
        User user = user(userId, "student@example.com");
        when(userRepository.findByEmailIgnoreCase(" Student@Example.COM "))
                .thenReturn(java.util.Optional.of(user));
        when(jwtService.generateAccessToken(userId, user.getEmail(), "STUDENT"))
                .thenReturn("access-token");
        when(jwtService.generateRefreshToken(userId)).thenReturn("refresh-token");

        var result = authenticationService.login(
                new LoginPayload(" Student@Example.COM ", "password123")
        );

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("student@example.com", "password123")
        );
        assertEquals("access-token", result.response().accessToken());
        assertEquals("refresh-token", result.refreshToken());
        assertEquals(userId, result.response().userId());
    }

    @Test
    void loginPropagatesInvalidCredentials() {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new org.springframework.security.authentication.BadCredentialsException("bad credentials"));

        assertThrows(
                org.springframework.security.authentication.BadCredentialsException.class,
                () -> authenticationService.login(new LoginPayload("student@example.com", "wrong"))
        );

        verifyNoInteractions(userRepository, jwtService);
    }

    @Test
    void refreshRejectsInvalidToken() {
        when(jwtService.isValidToken("invalid-token")).thenReturn(false);

        assertThrows(
                JwtException.class,
                () -> authenticationService.refresh("invalid-token")
        );

        verify(jwtService, never()).parseToken(anyString());
        verifyNoInteractions(userRepository);
    }

    @Test
    void refreshRejectsAccessToken() {
        when(jwtService.isValidToken("access-token")).thenReturn(true);
        when(jwtService.parseToken("access-token")).thenReturn(claims);
        when(claims.get("type", String.class)).thenReturn("access");

        assertThrows(
                JwtException.class,
                () -> authenticationService.refresh("access-token")
        );

        verifyNoInteractions(userRepository);
    }

    @Test
    void refreshReturnsNewTokensForValidRefreshToken() {
        UUID userId = UUID.randomUUID();
        User user = user(userId, "student@example.com");
        when(jwtService.isValidToken("refresh-token")).thenReturn(true);
        when(jwtService.parseToken("refresh-token")).thenReturn(claims);
        when(claims.get("type", String.class)).thenReturn("refresh");
        when(claims.getSubject()).thenReturn(userId.toString());
        when(userRepository.findById(userId)).thenReturn(java.util.Optional.of(user));
        when(jwtService.generateAccessToken(userId, user.getEmail(), "STUDENT"))
                .thenReturn("new-access-token");
        when(jwtService.generateRefreshToken(userId)).thenReturn("new-refresh-token");

        var result = authenticationService.refresh("refresh-token");

        assertEquals("new-access-token", result.response().accessToken());
        assertEquals("new-refresh-token", result.refreshToken());
        verify(userRepository).findById(userId);
    }

    private User user(UUID id, String email) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setRole(Role.STUDENT);
        return user;
    }
}
