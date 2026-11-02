package com.example.backend.services;

import com.example.backend.entities.Profile;
import com.example.backend.entities.User;
import com.example.backend.entities.Wallet;
import com.example.backend.exceptions.EmailAlreadyRegisteredException;
import com.example.backend.factories.UserFactory;
import com.example.backend.payloads.auth.RegistrationPayload;
import com.example.backend.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserFactory userFactory;

    @Mock
    private WalletService walletService;

    private RegistrationService registrationService;

    @BeforeEach
    void setUp() {
        registrationService = new RegistrationService(
                userRepository,
                passwordEncoder,
                userFactory,
                walletService
        );
    }

    @Test
    void registerCreatesUserWithEncodedPasswordAndWelcomeWallet() {
        RegistrationPayload payload = payload(" Student@Example.COM ", " Password123 ");
        User user = userWithProfile();
        Wallet wallet = new Wallet();

        when(userRepository.existsByEmailIgnoreCase("student@example.com")).thenReturn(false);
        when(passwordEncoder.encode(" Password123 ")).thenReturn("encoded-password");
        when(userFactory.createFromRegistration(payload, "encoded-password")).thenReturn(user);
        when(walletService.createWalletWithWelcomeBonus(user, 100L)).thenReturn(wallet);
        when(userRepository.save(user)).thenReturn(user);

        var result = registrationService.register(payload);

        assertEquals(user.getId(), result.userId());
        assertEquals("student@example.com", result.email());
        assertEquals("Younes", result.firstName());
        assertEquals("Student", result.lastName());
        verify(userFactory).createFromRegistration(payload, "encoded-password");
        verify(walletService).createWalletWithWelcomeBonus(user, 100L);
        verify(userRepository).save(user);
        assertSame(wallet, user.getWallet());
    }

    @Test
    void registerRejectsEmailIgnoringCaseAndWhitespace() {
        RegistrationPayload payload = payload(" Student@Example.COM ", "password123");
        when(userRepository.existsByEmailIgnoreCase("student@example.com")).thenReturn(true);

        assertThrows(EmailAlreadyRegisteredException.class,
                () -> registrationService.register(payload));

        verifyNoInteractions(passwordEncoder, userFactory, walletService);
        verify(userRepository, never()).save(any());
    }

    @Test
    void registerPropagatesPasswordEncoderFailure() {
        RegistrationPayload payload = payload("student@example.com", "password123");
        when(userRepository.existsByEmailIgnoreCase("student@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenThrow(new IllegalStateException("encoder failed"));

        assertThrows(IllegalStateException.class, () -> registrationService.register(payload));
        verifyNoInteractions(userFactory, walletService);
        verify(userRepository, never()).save(any());
    }

    private RegistrationPayload payload(String email, String password) {
        return new RegistrationPayload(email, password, "Younes", "Student", "University");
    }

    private User userWithProfile() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("student@example.com");
        Profile profile = new Profile();
        profile.setFirstName("Younes");
        profile.setLastName("Student");
        user.setProfile(profile);
        return user;
    }
}
