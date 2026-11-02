package com.example.backend.services;

import com.example.backend.payloads.auth.RegistrationPayload;
import com.example.backend.dto.auth.RegistrationDto;

public interface RegistrationService {

    RegistrationDto register(RegistrationPayload payload);
}
