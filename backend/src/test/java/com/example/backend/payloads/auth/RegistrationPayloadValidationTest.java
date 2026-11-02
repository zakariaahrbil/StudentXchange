package com.example.backend.payloads.auth;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RegistrationPayloadValidationTest {

    private static jakarta.validation.ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidator() {
        validatorFactory.close();
    }

    @Test
    void acceptsValidPayload() {
        RegistrationPayload payload = new RegistrationPayload(
                "student@example.com", "password123", "Younes", "Student", null
        );

        assertTrue(validator.validate(payload).isEmpty());
    }

    @Test
    void rejectsInvalidEmailAndShortPassword() {
        RegistrationPayload payload = new RegistrationPayload(
                "invalid-email", "short", "Younes", "Student", null
        );

        var violations = validator.validate(payload);

        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    void rejectsBlankRequiredFields() {
        RegistrationPayload payload = new RegistrationPayload("", "password123", " ", "", null);

        var fields = validator.validate(payload).stream()
                .map(v -> v.getPropertyPath().toString())
                .toList();

        assertTrue(fields.contains("email"));
        assertTrue(fields.contains("firstName"));
        assertTrue(fields.contains("lastName"));
    }

    @Test
    void rejectsValuesLongerThanAllowedLimits() {
        RegistrationPayload payload = new RegistrationPayload(
                "a".repeat(256) + "@example.com",
                "p".repeat(73),
                "a".repeat(256),
                "b".repeat(256),
                "u".repeat(256)
        );

        var violations = validator.validate(payload);

        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("firstName")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("lastName")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("university")));
    }
}
