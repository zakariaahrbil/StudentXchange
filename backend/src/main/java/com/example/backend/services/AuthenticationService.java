package com.example.backend.services;

import com.example.backend.dto.auth.AuthResponseDto;
import com.example.backend.payloads.auth.LoginPayload;
import com.example.backend.payloads.auth.RefreshTokenPayload;

public interface AuthenticationService {

    AuthResponseDto login(LoginPayload payload);

    AuthResponseDto refresh(RefreshTokenPayload payload);
}
