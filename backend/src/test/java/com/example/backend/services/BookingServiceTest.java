package com.example.backend.services;

import com.example.backend.entities.*;
import com.example.backend.exceptions.BookingConflictException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.repositories.BookingRepository;
import com.example.backend.repositories.SkillRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.repositories.WalletRepository;
import com.example.backend.services.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private SkillRepository skillRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private WalletRepository walletRepository;

    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        bookingService = new BookingServiceImpl(
                bookingRepository, skillRepository, userRepository, walletRepository
        );
    }

    @Test
    void booksSkillAndHoldsPrice() {
        UUID buyerId = UUID.randomUUID();
        UUID ownerId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        User buyer = user(buyerId);
        User owner = user(ownerId);
        Skill skill = skill(skillId, owner, 25L);
        Wallet wallet = wallet(buyer, 100L);
        when(userRepository.findById(buyerId)).thenReturn(Optional.of(buyer));
        when(skillRepository.findById(skillId)).thenReturn(Optional.of(skill));
        when(bookingRepository.existsByBuyerIdAndSkillIdAndStatusIn(eq(buyerId), eq(skillId), anyList()))
                .thenReturn(false);
        when(walletRepository.findByUserId(buyerId)).thenReturn(Optional.of(wallet));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = bookingService.book(buyerId, skillId);

        assertEquals(BookingStatus.PENDING, result.status());
        assertEquals(25L, result.price());
        assertEquals(75L, wallet.getBalance());
        assertEquals(25L, wallet.getHeldBalance());
        assertEquals(Type.HOLD, wallet.getTransactions().get(0).getType());
    }

    @Test
    void rejectsBookingOwnSkill() {
        UUID ownerId = UUID.randomUUID();
        User owner = user(ownerId);
        Skill skill = skill(UUID.randomUUID(), owner, 25L);
        when(userRepository.findById(ownerId)).thenReturn(Optional.of(owner));
        when(skillRepository.findById(skill.getId())).thenReturn(Optional.of(skill));

        assertThrows(BookingConflictException.class, () -> bookingService.book(ownerId, skill.getId()));
        verify(walletRepository, never()).findByUserId(any());
    }

    @Test
    void rejectsBookingWithInsufficientBalance() {
        UUID buyerId = UUID.randomUUID();
        User buyer = user(buyerId);
        User owner = user(UUID.randomUUID());
        Skill skill = skill(UUID.randomUUID(), owner, 25L);
        when(userRepository.findById(buyerId)).thenReturn(Optional.of(buyer));
        when(skillRepository.findById(skill.getId())).thenReturn(Optional.of(skill));
        when(bookingRepository.existsByBuyerIdAndSkillIdAndStatusIn(eq(buyerId), eq(skill.getId()), anyList()))
                .thenReturn(false);
        when(walletRepository.findByUserId(buyerId)).thenReturn(Optional.of(wallet(buyer, 10L)));

        assertThrows(BookingConflictException.class, () -> bookingService.book(buyerId, skill.getId()));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void onlyOwnerCanAcceptBooking() {
        UUID ownerId = UUID.randomUUID();
        UUID otherUserId = UUID.randomUUID();
        Booking booking = booking(user(UUID.randomUUID()), user(ownerId), BookingStatus.PENDING, 25L);
        when(bookingRepository.findByIdAndSkillOwnerId(booking.getId(), otherUserId))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> bookingService.accept(otherUserId, booking.getId()));
    }

    @Test
    void completesBookingAndTransfersHeldTokens() {
        User buyer = user(UUID.randomUUID());
        User owner = user(UUID.randomUUID());
        Booking booking = booking(buyer, owner, BookingStatus.ACCEPTED, 25L);
        Wallet buyerWallet = wallet(buyer, 75L);
        buyerWallet.setHeldBalance(25L);
        Wallet ownerWallet = wallet(owner, 100L);
        when(bookingRepository.findById(booking.getId())).thenReturn(Optional.of(booking));
        when(walletRepository.findByUserId(buyer.getId())).thenReturn(Optional.of(buyerWallet));
        when(walletRepository.findByUserId(owner.getId())).thenReturn(Optional.of(ownerWallet));

        var result = bookingService.complete(buyer.getId(), booking.getId());

        assertEquals(BookingStatus.COMPLETED, result.status());
        assertEquals(0L, buyerWallet.getHeldBalance());
        assertEquals(125L, ownerWallet.getBalance());
        assertEquals(Type.EARN, ownerWallet.getTransactions().get(0).getType());
    }

    private User user(UUID id) {
        User user = new User();
        user.setId(id);
        return user;
    }

    private Skill skill(UUID id, User owner, long price) {
        Skill skill = new Skill();
        skill.setId(id);
        skill.setOwner(owner);
        skill.setName("Java");
        skill.setPrice(price);
        return skill;
    }

    private Wallet wallet(User user, long balance) {
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(balance);
        wallet.setHeldBalance(0L);
        return wallet;
    }

    private Booking booking(User buyer, User owner, BookingStatus status, long price) {
        Booking booking = new Booking();
        booking.setId(UUID.randomUUID());
        booking.setBuyer(buyer);
        booking.setSkill(skill(UUID.randomUUID(), owner, price));
        booking.setSkillOwner(owner);
        booking.setPrice(price);
        booking.setStatus(status);
        return booking;
    }
}
