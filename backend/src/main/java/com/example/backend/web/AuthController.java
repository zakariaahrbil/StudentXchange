package com.example.backend.web;

import com.example.backend.dto.auth.AuthResponseDto;
import com.example.backend.dto.auth.RegistrationDto;
import com.example.backend.payloads.auth.LoginPayload;
import com.example.backend.payloads.auth.RegistrationPayload;
import com.example.backend.security.CookieService;
import com.example.backend.services.AuthenticationService;
import com.example.backend.services.AuthenticationService.AuthResult;
import com.example.backend.services.RegistrationService;
import io.jsonwebtoken.JwtException;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegistrationService registrationService;
    private final AuthenticationService authenticationService;
    private final CookieService cookieService;

    public AuthController(
            RegistrationService registrationService,
            AuthenticationService authenticationService,
            CookieService cookieService
    ) {
        this.registrationService = registrationService;
        this.authenticationService = authenticationService;
        this.cookieService = cookieService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationDto register(@Valid @RequestBody RegistrationPayload payload) {
        return registrationService.register(payload);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginPayload payload) {
        AuthResult result = authenticationService.login(payload);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieService.createRefreshCookie(result.refreshToken()).toString())
                .body(result.response());
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken
    ) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new JwtException("Refresh token cookie is missing");
        }

        AuthResult result = authenticationService.refresh(refreshToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieService.createRefreshCookie(result.refreshToken()).toString())
                .body(result.response());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookieService.deleteRefreshCookie().toString())
                .build();
    }
}
