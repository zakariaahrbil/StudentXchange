package com.example.backend.dto.skill;

import com.example.backend.entities.Skill;

import java.util.UUID;

public record SkillDto(
        UUID id,
        String name,
        String description,
        Long price,
        Double averageRating
) {

    public SkillDto(UUID id, String name, String description, Long price) {
        this(id, name, description, price, null);
    }

    public SkillDto(UUID id, String name, Long price) {
        this(id, name, null, price);
    }

    public static SkillDto fromEntity(Skill skill) {
        return new SkillDto(skill.getId(), skill.getName(), skill.getDescription(), skill.getPrice(), null);
    }

    public static SkillDto fromEntity(Skill skill, Double averageRating) {
        return new SkillDto(
                skill.getId(),
                skill.getName(),
                skill.getDescription(),
                skill.getPrice(),
                averageRating
        );
    }
}
