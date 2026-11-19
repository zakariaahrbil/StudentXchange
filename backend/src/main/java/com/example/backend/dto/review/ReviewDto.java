package com.example.backend.dto.review;

import com.example.backend.entities.Review;

import java.time.Instant;
import java.util.UUID;

public record ReviewDto(
        UUID id,
        UUID skillId,
        UUID bookingId,
        UUID reviewerId,
        UUID skillOwnerId,
        Integer rating,
        String comment,
        Instant createdAt
) {
    public static ReviewDto fromEntity(Review review) {
        return new ReviewDto(
                review.getId(),
                review.getSkill().getId(),
                review.getBooking().getId(),
                review.getReviewer().getId(),
                review.getSkill().getOwner().getId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
