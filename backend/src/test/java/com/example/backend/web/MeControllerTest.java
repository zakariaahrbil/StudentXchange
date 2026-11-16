package com.example.backend.web;

import com.example.backend.dto.user.UserDto;
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
                null,
                com.example.backend.entities.Role.STUDENT,
                com.example.backend.entities.Status.ACTIVE,
                null
        );
        when(userService.getUserById(userId)).thenReturn(expected);

        UserDto actual = meController.getCurrentUser(principal);

        assertSame(expected, actual);
        verify(userService).getUserById(userId);
    }
}
