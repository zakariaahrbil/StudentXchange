package com.example.backend.dto.booking;

import com.example.backend.entities.Booking;
import com.example.backend.entities.BookingStatus;
import com.example.backend.entities.Profile;
import com.example.backend.entities.User;

import java.time.Instant;
import java.util.UUID;

public record BookingDto(
        UUID id,
        UUID buyerId,
        String buyerName,
        String buyerEmail,
        String buyerPhoneNumber,
        UUID skillId,
        UUID skillOwnerId,
        String skillOwnerName,
        String skillOwnerEmail,
        String skillOwnerPhoneNumber,
        String skillName,
        Long price,
        Instant realizationAt,
        String description,
        BookingStatus status,
        Instant createdAt,
        Instant updatedAt
) {
    public static BookingDto fromEntity(Booking booking) {
        User buyer = booking.getBuyer();
        User skillOwner = booking.getSkillOwner();
        return new BookingDto(
                booking.getId(),
                buyer.getId(),
                fullName(buyer.getProfile()),
                buyer.getEmail(),
                buyer.getProfile() != null ? buyer.getProfile().getPhoneNumber() : null,
                booking.getSkill().getId(),
                skillOwner.getId(),
                fullName(skillOwner.getProfile()),
                skillOwner.getEmail(),
                skillOwner.getProfile() != null ? skillOwner.getProfile().getPhoneNumber() : null,
                booking.getSkill().getName(),
                booking.getPrice(),
                booking.getRealizationAt(),
                booking.getDescription(),
                booking.getStatus(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }

    private static String fullName(Profile profile) {
        if (profile == null) {
            return null;
        }
        String firstName = profile.getFirstName();
        String lastName = profile.getLastName();
        if (firstName == null || firstName.isBlank()) {
            return lastName;
        }
        if (lastName == null || lastName.isBlank()) {
            return firstName;
        }
        return firstName.trim() + " " + lastName.trim();
    }
}
