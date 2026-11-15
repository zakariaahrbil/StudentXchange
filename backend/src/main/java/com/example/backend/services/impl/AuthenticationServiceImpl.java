package com.example.backend.services.impl;

import com.example.backend.dto.auth.AuthResponseDto;
import com.example.backend.entities.User;
import com.example.backend.payloads.auth.LoginPayload;
import com.example.backend.payloads.auth.RefreshTokenPayload;
import com.example.backend.repositories.UserRepository;
import com.example.backend.security.JwtService;
import com.example.backend.services.AuthenticationService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthenticationServiceImpl(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public AuthResponseDto login(LoginPayload payload) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        payload.email().trim().toLowerCase(),
                        payload.password()
                )
        );

        User user = userRepository.findByEmailIgnoreCase(payload.email())
                .orElseThrow(() -> new IllegalStateException("User authenticated but not found"));

        return buildAuthResponse(user);
    }

    @Override
    public AuthResponseDto refresh(RefreshTokenPayload payload) {
        String refreshToken = payload.refreshToken();

        if (!jwtService.isValidToken(refreshToken)) {
            throw new JwtException("Invalid or expired refresh token");
        }

        Claims claims = jwtService.parseToken(refreshToken);
        String tokenType = claims.get("type", String.class);

        if (!"refresh".equals(tokenType)) {
            throw new JwtException("Token is not a refresh token");
        }

        UUID userId = UUID.fromString(claims.getSubject());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new JwtException("User not found for refresh token"));

        return buildAuthResponse(user);
    }

    private AuthResponseDto buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtService.generateRefreshToken(user.getId());

        return new AuthResponseDto(
                accessToken,
                newRefreshToken,
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
