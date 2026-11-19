package com.example.backend.web;

import com.example.backend.dto.booking.BookingDto;
import com.example.backend.security.JwtUserPrincipal;
import com.example.backend.services.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/skills/{skillId}/book")
    @ResponseStatus(HttpStatus.CREATED)
    public BookingDto book(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID skillId
    ) {
        return bookingService.book(principal.userId(), skillId);
    }

    @GetMapping("/users/me/bookings")
    public List<BookingDto> findForUser(@AuthenticationPrincipal JwtUserPrincipal principal) {
        return bookingService.findForUser(principal.userId());
    }

    @PatchMapping("/bookings/{bookingId}/accept")
    public BookingDto accept(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID bookingId
    ) {
        return bookingService.accept(principal.userId(), bookingId);
    }

    @PatchMapping("/bookings/{bookingId}/reject")
    public BookingDto reject(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID bookingId
    ) {
        return bookingService.reject(principal.userId(), bookingId);
    }

    @PatchMapping("/bookings/{bookingId}/complete")
    public BookingDto complete(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID bookingId
    ) {
        return bookingService.complete(principal.userId(), bookingId);
    }

    @PatchMapping("/bookings/{bookingId}/cancel")
    public BookingDto cancel(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID bookingId
    ) {
        return bookingService.cancel(principal.userId(), bookingId);
    }
}
