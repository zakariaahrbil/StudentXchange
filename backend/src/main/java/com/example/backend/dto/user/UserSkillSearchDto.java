package com.example.backend.dto.user;

import com.example.backend.entities.Skill;
import com.example.backend.entities.User;

import java.util.UUID;

public record UserSkillSearchDto(
        UUID userId,
        String firstName,
        String lastName,
        String university,
        String avatarUrl,
        String phoneNumber,
        UUID skillId,
        String skillName,
        String skillDescription,
        Long skillPrice,
        Double skillRating
) {
    public static UserSkillSearchDto fromSkill(Skill skill, double skillRating) {
        User user = skill.getOwner();
        return new UserSkillSearchDto(
                user.getId(),
                user.getProfile() != null ? user.getProfile().getFirstName() : null,
                user.getProfile() != null ? user.getProfile().getLastName() : null,
                user.getProfile() != null ? user.getProfile().getUniversity() : null,
                user.getProfile() != null ? user.getProfile().getAvatarUrl() : null,
                user.getProfile() != null ? user.getProfile().getPhoneNumber() : null,
                skill.getId(),
                skill.getName(),
                skill.getDescription(),
                skill.getPrice(),
                skillRating
        );
    }
}
