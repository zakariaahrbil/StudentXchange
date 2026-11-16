package com.example.backend.services.impl;

import com.example.backend.entities.User;
import com.example.backend.entities.Wallet;
import com.example.backend.factories.WalletFactory;
import com.example.backend.services.WalletService;
import org.springframework.stereotype.Service;

@Service
public class WalletServiceImpl implements WalletService {

    private final WalletFactory walletFactory;

    public WalletServiceImpl(WalletFactory walletFactory) {
        this.walletFactory = walletFactory;
    }

    @Override
    public Wallet createWalletWithWelcomeBonus(User user, long welcomeBonus) {
        return walletFactory.createWithWelcomeBonus(user, welcomeBonus);
    }
}
