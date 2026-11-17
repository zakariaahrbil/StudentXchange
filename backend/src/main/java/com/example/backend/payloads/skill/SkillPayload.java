package com.example.backend.payloads.skill;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SkillPayload(
        @NotBlank
        @Size(max = 255)
        String name
) {
}
