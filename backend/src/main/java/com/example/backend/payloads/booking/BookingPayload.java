package com.example.backend.payloads.booking;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record BookingPayload(
        @NotNull(message = "realizationAt is required")
        @Future(message = "realizationAt must be in the future")
        Instant realizationAt
) {
}
