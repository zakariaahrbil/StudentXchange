package com.example.backend.services;

import com.example.backend.dto.booking.BookingDto;

import java.util.List;
import java.util.UUID;

public interface BookingService {
    BookingDto book(UUID buyerId, UUID skillId, java.time.Instant realizationAt, String description);
    List<BookingDto> findForUser(UUID userId);
    BookingDto accept(UUID ownerId, UUID bookingId);
    BookingDto reject(UUID ownerId, UUID bookingId);
    BookingDto complete(UUID userId, UUID bookingId);
    BookingDto cancel(UUID buyerId, UUID bookingId);
}
