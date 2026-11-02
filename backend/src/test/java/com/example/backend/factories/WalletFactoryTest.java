package com.example.backend.factories;

import com.example.backend.entities.Type;
import com.example.backend.entities.User;
import com.example.backend.entities.Wallet;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class WalletFactoryTest {

    private final WalletFactory walletFactory = new WalletFactory();

    @Test
    void createsWalletWithWelcomeBonusTransaction() {
        User user = new User();

        Wallet wallet = walletFactory.createWithWelcomeBonus(user, 100L);

        assertSame(user, wallet.getUser());
        assertEquals(100L, wallet.getBalance());
        assertEquals(0L, wallet.getHeldBalance());
        assertEquals(1, wallet.getTransactions().size());
        var transaction = wallet.getTransactions().getFirst();
        assertSame(wallet, transaction.getWallet());
        assertEquals(Type.WELCOME_BONUS, transaction.getType());
        assertEquals(100L, transaction.getAmount());
        assertEquals(100L, transaction.getBalanceAfter());
    }

    @Test
    void supportsZeroWelcomeBonus() {
        Wallet wallet = walletFactory.createWithWelcomeBonus(new User(), 0L);

        assertEquals(0L, wallet.getBalance());
        assertEquals(0L, wallet.getTransactions().getFirst().getAmount());
    }
}
