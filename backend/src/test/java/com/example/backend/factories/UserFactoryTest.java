package com.example.backend.factories;

import com.example.backend.entities.User;
import com.example.backend.payloads.auth.RegistrationPayload;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserFactoryTest {

    private final UserFactory userFactory = new UserFactory();

    @Test
    void createsUserAndProfileWithNormalizedValues() {
        RegistrationPayload payload = new RegistrationPayload(
                " Student@Example.COM ",
                "password123",
                " Younes ",
                " Student ",
                " University "
        );

        User user = userFactory.createFromRegistration(payload, "encoded");

        assertEquals("student@example.com", user.getEmail());
        assertEquals("encoded", user.getPasswordHash());
        assertNotNull(user.getProfile());
        assertSame(user, user.getProfile().getUser());
        assertEquals("Younes", user.getProfile().getFirstName());
        assertEquals("Student", user.getProfile().getLastName());
        assertEquals("University", user.getProfile().getUniversity());
    }

    @Test
    void convertsBlankUniversityToNull() {
        RegistrationPayload payload = new RegistrationPayload(
                "student@example.com", "password123", "Younes", "Student", "   "
        );

        User user = userFactory.createFromRegistration(payload, "encoded");

        assertNull(user.getProfile().getUniversity());
    }
}
