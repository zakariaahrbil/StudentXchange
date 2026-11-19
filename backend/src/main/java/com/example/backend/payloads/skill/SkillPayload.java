package com.example.backend.payloads.skill;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record SkillPayload(
        @NotBlank
        @Size(max = 255)
        String name,
        @Size(max = 2000)
        String description,
        @NotNull
        @Positive
        Long price
) {
    public SkillPayload(String name, Long price) {
        this(name, null, price);
    }
}
