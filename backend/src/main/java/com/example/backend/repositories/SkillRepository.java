package com.example.backend.repositories;

import com.example.backend.entities.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SkillRepository extends JpaRepository<Skill, UUID> {

    boolean existsByOwnerIdAndNameIgnoreCase(UUID ownerId, String name);

    Optional<Skill> findByIdAndOwnerId(UUID id, UUID ownerId);

    List<Skill> findByOwnerId(UUID ownerId);

    List<Skill> findByNameContainingIgnoreCase(String name);
}
