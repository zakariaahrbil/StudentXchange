package com.example.backend.factories;

import com.example.backend.entities.User;
import com.example.backend.payloads.auth.RegistrationPayload;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProfileFactoryTest {

    private final ProfileFactory profileFactory = new ProfileFactory();

    @Test
    void createsProfileLinkedToUserWithNormalizedValues() {
        User user = new User();
        RegistrationPayload payload = new RegistrationPayload(
                "student@example.com", "password123", " Younes ", " Student ", " University ",
                " Bio ", " https://example.com/avatar.png "
        );

        var profile = profileFactory.createFromRegistration(payload, user);

        assertSame(user, profile.getUser());
        assertEquals("Younes", profile.getFirstName());
        assertEquals("Student", profile.getLastName());
        assertEquals("University", profile.getUniversity());
        assertEquals("Bio", profile.getBio());
        assertEquals("https://example.com/avatar.png", profile.getAvatarUrl());
    }

    @Test
    void convertsBlankUniversityToNull() {
        RegistrationPayload payload = new RegistrationPayload(
                "student@example.com", "password123", "Younes", "Student", " ", " ", " "
        );

        var profile = profileFactory.createFromRegistration(payload, new User());

        assertNull(profile.getUniversity());
    }
}
