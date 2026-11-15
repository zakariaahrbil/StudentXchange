package com.example.backend.payloads.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginPayload(
        @NotBlank @Email String email,
        @NotBlank String password
) {
}
