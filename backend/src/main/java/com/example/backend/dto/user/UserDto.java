package com.example.backend.dto.user;

import com.example.backend.entities.Role;
import com.example.backend.entities.Status;
import com.example.backend.entities.User;

import java.time.Instant;
import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String firstName,
        String lastName,
        String university,
        String avatarUrl,
        Role role,
        Status status,
        Instant createdAt
) {

    public static UserDto fromEntity(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getProfile() != null ? user.getProfile().getFirstName() : null,
                user.getProfile() != null ? user.getProfile().getLastName() : null,
                user.getProfile() != null ? user.getProfile().getUniversity() : null,
                user.getProfile() != null ? user.getProfile().getAvatarUrl() : null,
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }
}
