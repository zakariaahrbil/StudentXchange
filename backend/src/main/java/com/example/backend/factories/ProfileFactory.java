package com.example.backend.factories;

import com.example.backend.entities.Profile;
import com.example.backend.entities.User;
import com.example.backend.payloads.auth.RegistrationPayload;
import org.springframework.stereotype.Component;

@Component
public class ProfileFactory {

    public Profile createFromRegistration(RegistrationPayload payload, User user) {
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setFirstName(payload.firstName().trim());
        profile.setLastName(payload.lastName().trim());
        profile.setUniversity(normalizeOptional(payload.university()));
        profile.setBio(normalizeOptional(payload.bio()));
        profile.setAvatarUrl(normalizeOptional(payload.avatarUrl()));
        return profile;
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
