package com.example.backend.services;

import com.example.backend.dto.auth.AuthResponseDto;
import com.example.backend.payloads.auth.LoginPayload;

public interface AuthenticationService {

    AuthResult login(LoginPayload payload);

    AuthResult refresh(String refreshToken);

    record AuthResult(AuthResponseDto response, String refreshToken) {}
}
