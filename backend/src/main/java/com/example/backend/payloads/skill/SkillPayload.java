package com.example.backend.payloads.skill;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record SkillPayload(
        @NotBlank
        @Size(max = 255)
        String name,
        @NotNull
        @Positive
        Long price
) {
}
