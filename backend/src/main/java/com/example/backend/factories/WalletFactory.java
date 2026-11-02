package com.example.backend.factories;

import com.example.backend.entities.Type;
import com.example.backend.entities.User;
import com.example.backend.entities.Wallet;
import com.example.backend.entities.WalletTransaction;
import org.springframework.stereotype.Component;

@Component
public class WalletFactory {

    public Wallet createWithWelcomeBonus(User user, long welcomeBonus) {
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(welcomeBonus);

        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setType(Type.WELCOME_BONUS);
        transaction.setAmount(welcomeBonus);
        transaction.setBalanceAfter(welcomeBonus);
        wallet.getTransactions().add(transaction);

        return wallet;
    }
}