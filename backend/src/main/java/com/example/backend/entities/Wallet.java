package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "wallets")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Long balance = 0L;

    @Column(nullable = false)
    private Long heldBalance = 0L;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "wallet")
    private List<WalletTransaction> transactions = new ArrayList<>();

    @Version
    @Column(nullable = false)
    private Long version = 0L;

}
