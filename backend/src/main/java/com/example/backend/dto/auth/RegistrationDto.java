package com.example.backend.dto.auth;

import com.example.backend.entities.User;

import java.util.UUID;

public record RegistrationDto(
        UUID userId,
        String email,
        String firstName,
        String lastName,
        long tokenBalance
) {

    public static RegistrationDto fromEntity(User user) {
        return new RegistrationDto(
                user.getId(),
                user.getEmail(),
                user.getProfile().getFirstName(),
                user.getProfile().getLastName(),
                user.getWallet().getBalance()
        );
    }
}
