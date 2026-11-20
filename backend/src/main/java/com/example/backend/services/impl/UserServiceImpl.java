package com.example.backend.services.impl;

import com.example.backend.dto.user.UserDto;
import com.example.backend.entities.User;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.UserService;
import com.example.backend.entities.Profile;
import com.example.backend.payloads.user.ProfilePayload;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::fromEntity)
                .toList();
    }

    @Override
    public UserDto getUserById(UUID id) {
        return userRepository.findById(id)
                .map(UserDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    @Transactional
    public UserDto updateProfile(UUID id, ProfilePayload payload) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        Profile profile = user.getProfile();
        if (profile == null) {
            profile = new Profile();
            profile.setUser(user);
            user.setProfile(profile);
        }

        profile.setFirstName(payload.firstName().trim());
        profile.setLastName(payload.lastName().trim());
        profile.setUniversity(normalizeOptional(payload.university()));
        profile.setBio(normalizeOptional(payload.bio()));
        profile.setAvatarUrl(normalizeOptional(payload.avatarUrl()));
        profile.setPhoneNumber(normalizeOptional(payload.phoneNumber()));

        return UserDto.fromEntity(userRepository.save(user));
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
