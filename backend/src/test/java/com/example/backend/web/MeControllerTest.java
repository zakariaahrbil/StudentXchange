package com.example.backend.web;

import com.example.backend.dto.user.UserDto;
import com.example.backend.payloads.user.ProfilePayload;
import com.example.backend.security.JwtUserPrincipal;
import com.example.backend.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MeControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private MeController meController;

    @Test
    void returnsCurrentUserForAuthenticatedPrincipal() {
        UUID userId = UUID.randomUUID();
        JwtUserPrincipal principal = new JwtUserPrincipal(
                userId,
                "student@example.com",
                "STUDENT"
        );
        UserDto expected = new UserDto(
                userId,
                "student@example.com",
                "Younes",
                "Student",
                "University",
                "Java and tutoring",
                null,
                null,
                100L,
                com.example.backend.entities.Role.STUDENT,
                com.example.backend.entities.Status.ACTIVE,
                null
        );
        when(userService.getUserById(userId)).thenReturn(expected);

        UserDto actual = meController.getCurrentUser(principal);

        assertSame(expected, actual);
        verify(userService).getUserById(userId);
    }

    @Test
    void updatesCurrentUserProfileForAuthenticatedPrincipal() {
        UUID userId = UUID.randomUUID();
        JwtUserPrincipal principal = new JwtUserPrincipal(
                userId,
                "student@example.com",
                "STUDENT"
        );
        ProfilePayload payload = new ProfilePayload(
                "Younes",
                "Updated",
                "New University",
                "New bio",
                null,
                "+212600000001"
        );
        UserDto expected = new UserDto(
                userId,
                "student@example.com",
                "Younes",
                "Updated",
                "New University",
                "New bio",
                null,
                "+212600000001",
                100L,
                com.example.backend.entities.Role.STUDENT,
                com.example.backend.entities.Status.ACTIVE,
                null
        );
        when(userService.updateProfile(userId, payload)).thenReturn(expected);

        UserDto actual = meController.updateProfile(principal, payload);

        assertSame(expected, actual);
        verify(userService).updateProfile(userId, payload);
    }
}
