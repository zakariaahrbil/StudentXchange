package com.example.backend.dto.auth;

import java.util.UUID;

public record AuthResponseDto(
        String accessToken,
        String refreshToken,
        UUID userId,
        String email,
        String role
) {
}
