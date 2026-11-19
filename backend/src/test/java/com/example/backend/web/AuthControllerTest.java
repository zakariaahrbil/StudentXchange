package com.example.backend.web;

import com.example.backend.dto.auth.AuthResponseDto;
import com.example.backend.dto.auth.RegistrationDto;
import com.example.backend.payloads.auth.RegistrationPayload;
import com.example.backend.security.CookieService;
import com.example.backend.services.AuthenticationService;
import com.example.backend.services.RegistrationService;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private RegistrationService registrationService;

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private CookieService cookieService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new AuthController(
                        registrationService,
                        authenticationService,
                        cookieService
                ))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void registerReturnsCreated() throws Exception {
        UUID userId = UUID.randomUUID();
        when(registrationService.register(any(RegistrationPayload.class)))
                .thenReturn(new RegistrationDto(
                        userId, "student@example.com", "Younes", "Student",
                        "University", null, null, null, 100
                ));

        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content("""
                                {
                                  "email": "student@example.com",
                                  "password": "password123",
                                  "firstName": "Younes",
                                  "lastName": "Student"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.tokenBalance").value(100));
    }

    @Test
    void registerRejectsInvalidPayload() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content("""
                                {
                                  "email": "invalid",
                                  "password": "short",
                                  "firstName": "",
                                  "lastName": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Request validation failed"))
                .andExpect(jsonPath("$.fieldErrors").isMap());

        verifyNoInteractions(registrationService);
    }

    @Test
    void registerMapsDuplicateEmailToConflict() throws Exception {
        when(registrationService.register(any(RegistrationPayload.class)))
                .thenThrow(new com.example.backend.exceptions.EmailAlreadyRegisteredException());

        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content(validRegistrationJson()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email is already registered"));
    }

    @Test
    void loginReturnsAccessTokenAndRefreshCookie() throws Exception {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "refresh-token")
                .httpOnly(true)
                .secure(true)
                .path("/api/auth")
                .build();
        when(authenticationService.login(any()))
                .thenReturn(new AuthenticationService.AuthResult(
                        new AuthResponseDto("access-token", UUID.randomUUID(),
                                "student@example.com", "STUDENT"),
                        "refresh-token"
                ));
        when(cookieService.createRefreshCookie("refresh-token")).thenReturn(cookie);

        mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("""
                                {"email":"student@example.com","password":"password123"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token"))
                .andExpect(header().string("Set-Cookie",
                        org.hamcrest.Matchers.containsString("refreshToken=refresh-token")));
    }

    @Test
    void loginMapsInvalidCredentialsToUnauthorized() throws Exception {
        when(authenticationService.login(any()))
                .thenThrow(new BadCredentialsException("bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("""
                                {"email":"student@example.com","password":"wrong"}
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    void refreshRequiresCookie() throws Exception {
        mockMvc.perform(post("/api/auth/refresh"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Refresh token cookie is missing"));
    }

    @Test
    void refreshReturnsNewTokensAndCookie() throws Exception {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "new-refresh-token").build();
        when(authenticationService.refresh("refresh-token"))
                .thenReturn(new AuthenticationService.AuthResult(
                        new AuthResponseDto("new-access-token", UUID.randomUUID(),
                                "student@example.com", "STUDENT"),
                        "new-refresh-token"
                ));
        when(cookieService.createRefreshCookie("new-refresh-token")).thenReturn(cookie);

        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new jakarta.servlet.http.Cookie("refreshToken", "refresh-token")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-access-token"))
                .andExpect(header().string("Set-Cookie",
                        org.hamcrest.Matchers.containsString("refreshToken=new-refresh-token")));
    }

    @Test
    void logoutClearsRefreshCookie() throws Exception {
        when(cookieService.deleteRefreshCookie())
                .thenReturn(ResponseCookie.from("refreshToken", "").maxAge(0).build());

        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isNoContent())
                .andExpect(header().string("Set-Cookie",
                        org.hamcrest.Matchers.containsString("Max-Age=0")));
    }

    @Test
    void refreshMapsInvalidTokenToUnauthorized() throws Exception {
        when(authenticationService.refresh("invalid-token"))
                .thenThrow(new JwtException("Invalid or expired refresh token"));

        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new jakarta.servlet.http.Cookie("refreshToken", "invalid-token")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid or expired refresh token"));
    }

    private String validRegistrationJson() {
        return """
                {
                  "email": "student@example.com",
                  "password": "password123",
                  "firstName": "Younes",
                  "lastName": "Student"
                }
                """;
    }
}
