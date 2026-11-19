package com.example.backend.repositories;

import com.example.backend.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    boolean existsByBookingId(UUID bookingId);
    List<Review> findBySkillIdOrderByCreatedAtDesc(UUID skillId);

    @Query("select coalesce(avg(r.rating), 0.0) from Review r where r.skill.id = :skillId")
    Double findAverageRatingBySkillId(@Param("skillId") UUID skillId);
}
