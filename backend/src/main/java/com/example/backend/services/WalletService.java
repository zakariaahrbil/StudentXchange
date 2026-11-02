package com.example.backend.services;

import com.example.backend.entities.User;
import com.example.backend.entities.Wallet;
import com.example.backend.factories.WalletFactory;
import org.springframework.stereotype.Service;

@Service
public class WalletService {

    private final WalletFactory walletFactory;

    public WalletService(WalletFactory walletFactory) {
        this.walletFactory = walletFactory;
    }

    public Wallet createWalletWithWelcomeBonus(User user, long welcomeBonus) {
        return walletFactory.createWithWelcomeBonus(user, welcomeBonus);
    }
}
