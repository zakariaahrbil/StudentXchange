package com.example.backend.payloads.auth;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenPayload(
        @NotBlank String refreshToken
) {
}
