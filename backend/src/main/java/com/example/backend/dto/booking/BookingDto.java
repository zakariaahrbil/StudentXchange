package com.example.backend.dto.booking;

import com.example.backend.entities.Booking;
import com.example.backend.entities.BookingStatus;

import java.time.Instant;
import java.util.UUID;

public record BookingDto(
        UUID id,
        UUID buyerId,
        UUID skillId,
        UUID skillOwnerId,
        String skillName,
        Long price,
        Instant realizationAt,
        String description,
        BookingStatus status,
        Instant createdAt,
        Instant updatedAt
) {
    public static BookingDto fromEntity(Booking booking) {
        return new BookingDto(
                booking.getId(),
                booking.getBuyer().getId(),
                booking.getSkill().getId(),
                booking.getSkillOwner().getId(),
                booking.getSkill().getName(),
                booking.getPrice(),
                booking.getRealizationAt(),
                booking.getDescription(),
                booking.getStatus(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }
}
