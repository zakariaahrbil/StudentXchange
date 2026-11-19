package com.example.backend.repositories;

import com.example.backend.entities.Booking;
import com.example.backend.entities.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByBuyerIdOrSkillOwnerIdOrderByCreatedAtDesc(UUID buyerId, UUID skillOwnerId);

    Optional<Booking> findByIdAndBuyerId(UUID id, UUID buyerId);

    Optional<Booking> findByIdAndSkillOwnerId(UUID id, UUID skillOwnerId);

    boolean existsByBuyerIdAndSkillIdAndStatusIn(UUID buyerId, UUID skillId, List<BookingStatus> statuses);
}
