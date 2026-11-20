package com.example.backend.payloads.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProfilePayload(
        @NotBlank @Size(max = 255) String firstName,
        @NotBlank @Size(max = 255) String lastName,
        @Size(max = 255) String university,
        @Size(max = 2000) String bio,
        @Size(max = 255) String avatarUrl,
        @Size(max = 32) @Pattern(
                regexp = "^\\+?[0-9()\\- .]*$",
                message = "phoneNumber contains invalid characters"
        ) String phoneNumber
) {
}
