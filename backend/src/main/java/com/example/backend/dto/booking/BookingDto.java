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
                booking.getStatus(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }
}
