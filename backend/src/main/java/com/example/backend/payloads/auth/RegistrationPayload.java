package com.example.backend.payloads.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public record RegistrationPayload(
        @NotBlank @Email @Size(max = 255) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotBlank @Size(max = 255) String firstName,
        @NotBlank @Size(max = 255) String lastName,
        @Size(max = 255) String university,
        @Size(max = 2000) String bio,
        @Size(max = 255) String avatarUrl,
        @Size(max = 32) @Pattern(
                regexp = "^\\+?[0-9()\\- .]*$",
                message = "phoneNumber contains invalid characters"
        ) String phoneNumber
){
}
