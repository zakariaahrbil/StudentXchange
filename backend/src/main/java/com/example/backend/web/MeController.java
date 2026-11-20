package com.example.backend.web;

import com.example.backend.dto.user.UserDto;
import com.example.backend.security.JwtUserPrincipal;
import com.example.backend.services.UserService;
import com.example.backend.payloads.user.ProfilePayload;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/users")
public class MeController {

    private final UserService userService;

    public MeController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public UserDto getCurrentUser(@AuthenticationPrincipal JwtUserPrincipal principal) {
        return userService.getUserById(principal.userId());
    }

    @PutMapping("/me/profile")
    @ResponseStatus(HttpStatus.OK)
    public UserDto updateProfile(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @Valid @RequestBody ProfilePayload payload
    ) {
        return userService.updateProfile(principal.userId(), payload);
    }
}
