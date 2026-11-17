package com.example.backend.services;

import com.example.backend.entities.Skill;
import com.example.backend.entities.User;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.repositories.SkillRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.impl.SkillServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillServiceTest {

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private UserRepository userRepository;

    private SkillService skillService;

    @BeforeEach
    void setUp() {
        skillService = new SkillServiceImpl(skillRepository, userRepository);
    }

    @Test
    void createsSkillForUser() {
        UUID userId = UUID.randomUUID();
        User user = user(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(skillRepository.existsByOwnerIdAndNameIgnoreCase(userId, "Java")).thenReturn(false);

        var result = skillService.createForUser(userId, " Java ");

        assertNull(result.id());
        assertEquals("Java", result.name());
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
                () -> skillService.createForUser(userId, "Java")
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
                () -> skillService.updateForUser(userId, skillId, "Rust")
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
                () -> skillService.updateForUser(userId, UUID.randomUUID(), "Rust")
        );
    }

    private User user(UUID id) {
        User user = new User();
        user.setId(id);
        return user;
    }
}
