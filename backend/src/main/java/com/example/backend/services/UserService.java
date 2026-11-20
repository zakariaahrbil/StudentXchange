package com.example.backend.services;

import com.example.backend.dto.user.UserDto;
import com.example.backend.payloads.user.ProfilePayload;

import java.util.List;
import java.util.UUID;

public interface UserService {

    List<UserDto> getAllUsers();

    UserDto getUserById(UUID id);

    UserDto updateProfile(UUID id, ProfilePayload payload);
}
