package com.example.backend.services;

import com.example.backend.entities.*;
import com.example.backend.exceptions.BookingConflictException;
import com.example.backend.repositories.BookingRepository;
import com.example.backend.repositories.ReviewRepository;
import com.example.backend.services.impl.ReviewServiceImpl;
import com.example.backend.payloads.review.ReviewPayload;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;
    @Mock
    private BookingRepository bookingRepository;

    private ReviewService reviewService;

    @BeforeEach
    void setUp() {
        reviewService = new ReviewServiceImpl(reviewRepository, bookingRepository);
    }

    @Test
    void buyerCanReviewCompletedBooking() {
        User buyer = user();
        User owner = user();
        Booking booking = booking(buyer, owner, BookingStatus.COMPLETED);
        when(bookingRepository.findById(booking.getId())).thenReturn(Optional.of(booking));
        when(reviewRepository.existsByBookingId(booking.getId())).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> {
            Review review = invocation.getArgument(0);
            review.setId(UUID.randomUUID());
            review.setCreatedAt(Instant.now());
            return review;
        });

        var result = reviewService.create(
                buyer.getId(), booking.getSkill().getId(),
                new ReviewPayload(booking.getId(), 5, " Excellent exchange ")
        );

        assertEquals(5, result.rating());
        assertEquals("Excellent exchange", result.comment());
        assertEquals(owner.getId(), result.skillOwnerId());
    }

    @Test
    void rejectsReviewBeforeCompletion() {
        User buyer = user();
        Booking booking = booking(buyer, user(), BookingStatus.ACCEPTED);
        when(bookingRepository.findById(booking.getId())).thenReturn(Optional.of(booking));

        assertThrows(BookingConflictException.class, () ->
                reviewService.create(buyer.getId(), booking.getSkill().getId(),
                        new ReviewPayload(booking.getId(), 4, "Not yet"))
        );
    }

    @Test
    void rejectsReviewByUnrelatedUser() {
        Booking booking = booking(user(), user(), BookingStatus.COMPLETED);
        when(bookingRepository.findById(booking.getId())).thenReturn(Optional.of(booking));

        assertThrows(BookingConflictException.class, () ->
                reviewService.create(UUID.randomUUID(), booking.getSkill().getId(),
                        new ReviewPayload(booking.getId(), 4, "No access"))
        );
    }

    private User user() {
        User user = new User();
        user.setId(UUID.randomUUID());
        return user;
    }

    private Booking booking(User buyer, User owner, BookingStatus status) {
        Booking booking = new Booking();
        booking.setId(UUID.randomUUID());
        booking.setBuyer(buyer);
        booking.setSkillOwner(owner);
        Skill skill = new Skill();
        skill.setId(UUID.randomUUID());
        skill.setOwner(owner);
        booking.setSkill(skill);
        booking.setStatus(status);
        return booking;
    }
}
