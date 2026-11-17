package com.example.backend.dto.skill;

import com.example.backend.entities.Skill;

import java.util.UUID;

public record SkillDto(UUID id, String name) {

    public static SkillDto fromEntity(Skill skill) {
        return new SkillDto(skill.getId(), skill.getName());
    }
}
