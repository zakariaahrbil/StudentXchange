package com.example.backend.factories;

import com.example.backend.entities.User;
import com.example.backend.payloads.auth.RegistrationPayload;
import org.springframework.stereotype.Component;

@Component
public class UserFactory {

    public User createFromRegistration(RegistrationPayload payload, String passwordHash) {
        User user = new User();
        user.setEmail(payload.email().trim().toLowerCase());
        user.setPasswordHash(passwordHash);
        return user;
    }
}