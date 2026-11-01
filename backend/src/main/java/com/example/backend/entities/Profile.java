package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "profiles")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Profile {

    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String university;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String avatarUrl;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

}
