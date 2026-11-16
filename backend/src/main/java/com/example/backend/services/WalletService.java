package com.example.backend.services;

import com.example.backend.entities.User;
import com.example.backend.entities.Wallet;

public interface WalletService {

    Wallet createWalletWithWelcomeBonus(User user, long welcomeBonus);
}
