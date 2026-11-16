package com.example.backend.security;

import com.example.backend.config.JwtProperties;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class CookieService {

    private static final String REFRESH_COOKIE_NAME = "refreshToken";

    private final long refreshTokenMaxAgeSec;

    public CookieService(JwtProperties jwtProperties) {
        this.refreshTokenMaxAgeSec = jwtProperties.refreshTokenExpirationMs() / 1000;
    }

    public ResponseCookie createRefreshCookie(String refreshToken) {
        return ResponseCookie.from(REFRESH_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(refreshTokenMaxAgeSec)
                .build();
    }

    public ResponseCookie deleteRefreshCookie() {
        return ResponseCookie.from(REFRESH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(0)
                .build();
    }
}
