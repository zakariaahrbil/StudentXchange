package com.example.backend.services;

import com.example.backend.entities.Skill;
import com.example.backend.entities.User;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.repositories.SkillRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.repositories.ReviewRepository;
import com.example.backend.services.impl.SkillServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillServiceTest {

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReviewRepository reviewRepository;

    private SkillService skillService;

    @BeforeEach
    void setUp() {
        skillService = new SkillServiceImpl(skillRepository, userRepository, reviewRepository);
    }

    @Test
    void createsSkillForUser() {
        UUID userId = UUID.randomUUID();
        User user = user(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(skillRepository.existsByOwnerIdAndNameIgnoreCase(userId, "Java")).thenReturn(false);

        var result = skillService.createForUser(userId, " Java ", 25L);

        assertNull(result.id());
        assertEquals("Java", result.name());
        assertEquals(25L, result.price());
        verify(skillRepository).save(any(Skill.class));
    }

    @Test
    void rejectsDuplicateOwnedSkill() {
        UUID userId = UUID.randomUUID();
        User user = user(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(skillRepository.existsByOwnerIdAndNameIgnoreCase(userId, "Java")).thenReturn(true);

        assertThrows(
                IllegalArgumentException.class,
                () -> skillService.createForUser(userId, "Java", 25L)
        );

        verify(skillRepository, never()).save(any());
    }

    @Test
    void rejectsUpdatingSkillOwnedByAnotherUser() {
        UUID userId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        when(skillRepository.findByIdAndOwnerId(skillId, userId)).thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> skillService.updateForUser(userId, skillId, "Rust", 25L)
        );
    }

    @Test
    void rejectsDeletingSkillOwnedByAnotherUser() {
        UUID userId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        when(skillRepository.findByIdAndOwnerId(skillId, userId)).thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> skillService.deleteForUser(userId, skillId)
        );
    }

    @Test
    void rejectsMissingOwnedSkill() {
        UUID userId = UUID.randomUUID();
        when(skillRepository.findByIdAndOwnerId(any(), eq(userId))).thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> skillService.updateForUser(userId, UUID.randomUUID(), "Rust", 25L)
        );
    }

    @Test
    void includesAverageSkillRatingInUserSearch() {
        UUID skillId = UUID.randomUUID();
        Skill skill = new Skill();
        skill.setId(skillId);
        skill.setName("Java");
        skill.setPrice(25L);
        skill.setOwner(user(UUID.randomUUID()));
        when(skillRepository.findByNameContainingIgnoreCase("java")).thenReturn(List.of(skill));
        when(reviewRepository.findAverageRatingBySkillId(skillId)).thenReturn(4.5);

        var result = skillService.searchUsersBySkill("java");

        assertEquals(1, result.size());
        assertEquals(4.5, result.get(0).skillRating());
        verify(reviewRepository).findAverageRatingBySkillId(skillId);
    }

    @Test
    void findsOnlySkillsOwnedByUser() {
        UUID userId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        Skill skill = new Skill();
        skill.setId(skillId);
        skill.setName("Java");
        skill.setDescription("Backend tutoring");
        skill.setPrice(25L);
        skill.setOwner(user(userId));
        when(skillRepository.findByOwnerId(userId)).thenReturn(List.of(skill));

        var result = skillService.findForUser(userId);

        assertEquals(1, result.size());
        assertEquals(skillId, result.get(0).id());
        assertEquals("Java", result.get(0).name());
        assertEquals("Backend tutoring", result.get(0).description());
        verify(skillRepository).findByOwnerId(userId);
    }

    @Test
    void excludesSearcherFromUserSkillResults() {
        UUID searcherId = UUID.randomUUID();
        UUID otherOwnerId = UUID.randomUUID();
        Skill ownSkill = new Skill();
        ownSkill.setId(UUID.randomUUID());
        ownSkill.setName("Java");
        ownSkill.setPrice(20L);
        ownSkill.setOwner(user(searcherId));
        Skill otherSkill = new Skill();
        otherSkill.setId(UUID.randomUUID());
        otherSkill.setName("Java");
        otherSkill.setPrice(25L);
        otherSkill.setOwner(user(otherOwnerId));
        when(skillRepository.findByNameContainingIgnoreCase("java"))
                .thenReturn(List.of(ownSkill, otherSkill));
        when(reviewRepository.findAverageRatingBySkillId(otherSkill.getId())).thenReturn(4.0);

        var result = skillService.searchUsersBySkill("java", searcherId);

        assertEquals(1, result.size());
        assertEquals(otherOwnerId, result.get(0).userId());
        verify(reviewRepository, never()).findAverageRatingBySkillId(ownSkill.getId());
    }

    private User user(UUID id) {
        User user = new User();
        user.setId(id);
        return user;
    }
}
