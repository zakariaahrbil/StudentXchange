package com.example.backend.web;

import com.example.backend.dto.auth.RegistrationDto;
import com.example.backend.payloads.auth.RegistrationPayload;
import com.example.backend.services.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegistrationService registrationService;

    public AuthController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationDto register(@Valid @RequestBody RegistrationPayload payload) {
        return registrationService.register(payload);
    }
}
