package com.example.backend.web;

import com.example.backend.dto.auth.AuthResponseDto;
import com.example.backend.dto.auth.RegistrationDto;
import com.example.backend.payloads.auth.LoginPayload;
import com.example.backend.payloads.auth.RefreshTokenPayload;
import com.example.backend.payloads.auth.RegistrationPayload;
import com.example.backend.services.AuthenticationService;
import com.example.backend.services.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegistrationService registrationService;
    private final AuthenticationService authenticationService;

    public AuthController(
            RegistrationService registrationService,
            AuthenticationService authenticationService
    ) {
        this.registrationService = registrationService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationDto register(@Valid @RequestBody RegistrationPayload payload) {
        return registrationService.register(payload);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponseDto login(@Valid @RequestBody LoginPayload payload) {
        return authenticationService.login(payload);
    }

    @PostMapping("/refresh")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponseDto refresh(@Valid @RequestBody RefreshTokenPayload payload) {
        return authenticationService.refresh(payload);
    }
}
