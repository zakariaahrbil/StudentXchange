package com.example.backend.factories;

import com.example.backend.entities.User;
import com.example.backend.payloads.auth.RegistrationPayload;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserFactoryTest {

    private final UserFactory userFactory = new UserFactory();

    @Test
    void createsUserWithNormalizedCredentials() {
        RegistrationPayload payload = new RegistrationPayload(
                " Student@Example.COM ",
                "password123",
                " Younes ",
                " Student ",
                " University ", null, null
        );

        User user = userFactory.createFromRegistration(payload, "encoded");

        assertEquals("student@example.com", user.getEmail());
        assertEquals("encoded", user.getPasswordHash());
        assertNull(user.getProfile());
    }
}
