package com.example.backend.services.impl;

import com.example.backend.dto.skill.SkillDto;
import com.example.backend.dto.user.UserSkillSearchDto;
import com.example.backend.entities.Skill;
import com.example.backend.entities.User;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.repositories.SkillRepository;
import com.example.backend.repositories.ReviewRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.SkillService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public SkillServiceImpl(
            SkillRepository skillRepository,
            UserRepository userRepository,
            ReviewRepository reviewRepository
    ) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDto> search(String query) {
        String normalizedQuery = query == null ? "" : query.trim();
        List<Skill> skills = normalizedQuery.isBlank()
                ? skillRepository.findAll()
                : skillRepository.findByNameContainingIgnoreCase(normalizedQuery);

        return skills.stream()
                .map(skill -> SkillDto.fromEntity(
                        skill,
                        roundedRating(reviewRepository.findAverageRatingBySkillId(skill.getId()))
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSkillSearchDto> searchUsersBySkill(String skillQuery) {
        return searchUsersBySkill(skillQuery, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSkillSearchDto> searchUsersBySkill(String skillQuery, UUID searcherId) {
        String normalizedQuery = skillQuery == null ? "" : skillQuery.trim();
        if (normalizedQuery.isBlank()) {
            return List.of();
        }
        return skillRepository.findByNameContainingIgnoreCase(normalizedQuery)
                .stream()
                .filter(skill -> searcherId == null
                        || !skill.getOwner().getId().equals(searcherId))
                .map(skill -> UserSkillSearchDto.fromSkill(
                        skill, roundedRating(reviewRepository.findAverageRatingBySkillId(skill.getId()))
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDto> findForUser(UUID userId) {
        return skillRepository.findByOwnerId(userId)
                .stream()
                .map(skill -> SkillDto.fromEntity(
                        skill,
                        roundedRating(reviewRepository.findAverageRatingBySkillId(skill.getId()))
                ))
                .toList();
    }

    private double roundedRating(Double rating) {
        double value = rating == null ? 0.0 : rating;
        return Math.round(value * 100.0) / 100.0;
    }

    @Override
    @Transactional
    public SkillDto createForUser(UUID userId, String skillName, String description, Long price) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String normalizedName = skillName.trim();
        if (skillRepository.existsByOwnerIdAndNameIgnoreCase(userId, normalizedName)) {
            throw new IllegalArgumentException("Skill already exists for this user: " + normalizedName);
        }

        Skill skill = new Skill();
        skill.setOwner(user);
        skill.setName(normalizedName);
        skill.setDescription(normalizeOptional(description));
        skill.setPrice(price);
        user.getSkills().add(skill);
        skillRepository.save(skill);
        userRepository.save(user);
        return SkillDto.fromEntity(skill);
    }

    @Override
    @Transactional
    public SkillDto updateForUser(UUID userId, UUID skillId, String skillName, String description, Long price) {
        Skill skill = skillRepository.findByIdAndOwnerId(skillId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + skillId));
        String normalizedName = skillName.trim();
        if (!skill.getName().equalsIgnoreCase(normalizedName)
                && skillRepository.existsByOwnerIdAndNameIgnoreCase(userId, normalizedName)) {
            throw new IllegalArgumentException("Skill already exists for this user: " + normalizedName);
        }
        skill.setName(normalizedName);
        skill.setDescription(normalizeOptional(description));
        skill.setPrice(price);
        return SkillDto.fromEntity(skillRepository.save(skill));
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    @Override
    @Transactional
    public void deleteForUser(UUID userId, UUID skillId) {
        Skill skill = skillRepository.findByIdAndOwnerId(skillId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + skillId));
        skill.getOwner().getSkills().remove(skill);
        skillRepository.delete(skill);
    }
}
