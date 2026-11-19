package com.example.backend.services;

import com.example.backend.dto.skill.SkillDto;

import java.util.List;
import java.util.UUID;

public interface SkillService {

    List<SkillDto> search(String query);

    SkillDto createForUser(UUID userId, String skillName, Long price);

    SkillDto updateForUser(UUID userId, UUID skillId, String skillName, Long price);

    void deleteForUser(UUID userId, UUID skillId);
}
