package com.example.backend.services.impl;

import com.example.backend.dto.auth.RegistrationDto;
import com.example.backend.entities.User;
import com.example.backend.exceptions.EmailAlreadyRegisteredException;
import com.example.backend.factories.ProfileFactory;
import com.example.backend.factories.UserFactory;
import com.example.backend.factories.WalletFactory;
import com.example.backend.payloads.auth.RegistrationPayload;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.RegistrationService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private static final long WELCOME_BONUS = 100L;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserFactory userFactory;
    private final ProfileFactory profileFactory;
    private final WalletFactory walletFactory;

    public RegistrationServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            UserFactory userFactory,
            ProfileFactory profileFactory,
            WalletFactory walletFactory
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userFactory = userFactory;
        this.profileFactory = profileFactory;
        this.walletFactory = walletFactory;
    }

    @Override
    @Transactional
    public RegistrationDto register(RegistrationPayload payload) {
        String email = payload.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new EmailAlreadyRegisteredException();
        }

        User user = userFactory.createFromRegistration(
                payload,
                passwordEncoder.encode(payload.password())
        );
        user.setProfile(profileFactory.createFromRegistration(payload, user));
        user.setWallet(walletFactory.createWithWelcomeBonus(user, WELCOME_BONUS));

        User savedUser = userRepository.save(user);
        return RegistrationDto.fromEntity(savedUser);
    }
}
