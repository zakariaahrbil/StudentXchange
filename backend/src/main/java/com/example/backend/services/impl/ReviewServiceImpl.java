package com.example.backend.services.impl;

import com.example.backend.dto.review.ReviewDto;
import com.example.backend.entities.Booking;
import com.example.backend.entities.BookingStatus;
import com.example.backend.entities.Review;
import com.example.backend.exceptions.BookingConflictException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.repositories.BookingRepository;
import com.example.backend.repositories.ReviewRepository;
import com.example.backend.services.ReviewService;
import com.example.backend.payloads.review.ReviewPayload;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, BookingRepository bookingRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    @Transactional
    public ReviewDto create(UUID reviewerId, UUID skillId, ReviewPayload payload) {
        Booking booking = bookingRepository.findById(payload.bookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + payload.bookingId()));
        if (!booking.getSkill().getId().equals(skillId)) {
            throw new BookingConflictException("Booking does not belong to this skill");
        }
        if (!booking.getBuyer().getId().equals(reviewerId)) {
            throw new BookingConflictException("Only the buyer can review this booking");
        }
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BookingConflictException("Only completed bookings can be reviewed");
        }
        if (reviewRepository.existsByBookingId(payload.bookingId())) {
            throw new BookingConflictException("This exchange has already been reviewed");
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setSkill(booking.getSkill());
        review.setReviewer(booking.getBuyer());
        review.setRating(payload.rating());
        review.setComment(payload.comment().trim());
        return ReviewDto.fromEntity(reviewRepository.save(review));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDto> findForSkill(UUID skillId) {
        return reviewRepository.findBySkillIdOrderByCreatedAtDesc(skillId)
                .stream().map(ReviewDto::fromEntity).toList();
    }
}
