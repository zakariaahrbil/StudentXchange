package com.example.backend.services;

import com.example.backend.dto.auth.RegistrationDto;
import com.example.backend.payloads.auth.RegistrationPayload;

public interface RegistrationService {

    RegistrationDto register(RegistrationPayload payload);
}
