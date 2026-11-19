package com.example.backend.repositories;

import com.example.backend.entities.Skill;
import com.example.backend.entities.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.exception.ConstraintViolationException;

import jakarta.persistence.EntityManager;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class SkillRepositoryIntegrationTest {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void persistsSkillOwnerAndReloadsIt() {
        User owner = saveUser("owner-" + UUID.randomUUID() + "@example.com");
        Skill skill = saveSkill(owner, "Java", 25L);

        entityManager.clear();

        Skill reloaded = skillRepository.findById(skill.getId()).orElseThrow();

        assertEquals(owner.getId(), reloaded.getOwner().getId());
        assertEquals("Java", reloaded.getName());
        assertEquals(25L, reloaded.getPrice());
    }

    @Test
    void rejectsDuplicateSkillNameForSameOwnerIgnoringCase() {
        User owner = saveUser("owner-" + UUID.randomUUID() + "@example.com");
        saveSkill(owner, "Java", 25L);

        Skill duplicate = new Skill();
        duplicate.setOwner(owner);
        duplicate.setName("java");
        duplicate.setPrice(30L);

        skillRepository.save(duplicate);

        assertThrows(ConstraintViolationException.class, () -> entityManager.flush());
    }

    @Test
    void allowsSameSkillNameForDifferentOwners() {
        User firstOwner = saveUser("first-" + UUID.randomUUID() + "@example.com");
        User secondOwner = saveUser("second-" + UUID.randomUUID() + "@example.com");

        saveSkill(firstOwner, "Java", 25L);
        assertDoesNotThrow(() -> saveSkill(secondOwner, "Java", 30L));
    }

    @Test
    void rejectsSkillWithoutOwner() {
        Skill skill = new Skill();
        skill.setName("Java");
        skill.setPrice(25L);

        skillRepository.save(skill);

        assertThrows(ConstraintViolationException.class, () -> entityManager.flush());
    }

    @Test
    void deletesSkillWithoutDeletingOwner() {
        User owner = saveUser("owner-" + UUID.randomUUID() + "@example.com");
        Skill skill = saveSkill(owner, "Java", 25L);

        skillRepository.delete(skill);
        entityManager.flush();
        entityManager.clear();

        assertTrue(skillRepository.findById(skill.getId()).isEmpty());
        assertTrue(userRepository.findById(owner.getId()).isPresent());
    }

    private User saveUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash("test-password");
        return userRepository.saveAndFlush(user);
    }

    private Skill saveSkill(User owner, String name, Long price) {
        Skill skill = new Skill();
        skill.setOwner(owner);
        skill.setName(name);
        skill.setPrice(price);
        return skillRepository.saveAndFlush(skill);
    }
}
