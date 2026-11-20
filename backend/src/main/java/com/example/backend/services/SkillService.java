package com.example.backend.services;

import com.example.backend.dto.skill.SkillDto;
import com.example.backend.dto.user.UserSkillSearchDto;

import java.util.List;
import java.util.UUID;

public interface SkillService {

    List<SkillDto> search(String query);
    List<UserSkillSearchDto> searchUsersBySkill(String skillQuery);
    default List<UserSkillSearchDto> searchUsersBySkill(String skillQuery, UUID searcherId) {
        return searchUsersBySkill(skillQuery);
    }
    List<SkillDto> findForUser(UUID userId);

    SkillDto createForUser(UUID userId, String skillName, String description, Long price);
    default SkillDto createForUser(UUID userId, String skillName, Long price) {
        return createForUser(userId, skillName, null, price);
    }
    SkillDto updateForUser(UUID userId, UUID skillId, String skillName, String description, Long price);
    default SkillDto updateForUser(UUID userId, UUID skillId, String skillName, Long price) {
        return updateForUser(userId, skillId, skillName, null, price);
    }

    void deleteForUser(UUID userId, UUID skillId);
}
