package com.example.backend.services.impl;

import com.example.backend.dto.booking.BookingDto;
import com.example.backend.entities.*;
import com.example.backend.exceptions.BookingConflictException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.repositories.BookingRepository;
import com.example.backend.repositories.SkillRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.repositories.WalletRepository;
import com.example.backend.services.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            SkillRepository skillRepository,
            UserRepository userRepository,
            WalletRepository walletRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    @Override
    @Transactional
    public BookingDto book(UUID buyerId, UUID skillId, java.time.Instant realizationAt, String description) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + buyerId));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + skillId));
        if (skill.getOwner().getId().equals(buyerId)) {
            throw new BookingConflictException("You cannot book your own skill");
        }
        if (bookingRepository.existsByBuyerIdAndSkillIdAndStatusIn(
                buyerId, skillId, List.of(BookingStatus.PENDING, BookingStatus.ACCEPTED))) {
            throw new BookingConflictException("An active booking already exists for this skill");
        }

        Wallet wallet = walletFor(buyerId);
        hold(wallet, skill.getPrice());

        Booking booking = new Booking();
        booking.setBuyer(buyer);
        booking.setSkill(skill);
        booking.setSkillOwner(skill.getOwner());
        booking.setPrice(skill.getPrice());
        booking.setRealizationAt(realizationAt);
        booking.setDescription(normalizeDescription(description));
        booking.setStatus(BookingStatus.PENDING);
        addTransaction(wallet, Type.HOLD, skill.getPrice(), wallet.getBalance());
        return BookingDto.fromEntity(bookingRepository.save(booking));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDto> findForUser(UUID userId) {
        return bookingRepository.findByBuyerIdOrSkillOwnerIdOrderByCreatedAtDesc(userId, userId)
                .stream().map(BookingDto::fromEntity).toList();
    }

    @Override
    @Transactional
    public BookingDto accept(UUID ownerId, UUID bookingId) {
        Booking booking = ownerBooking(ownerId, bookingId);
        requireStatus(booking, BookingStatus.PENDING);
        booking.setStatus(BookingStatus.ACCEPTED);
        return BookingDto.fromEntity(booking);
    }

    @Override
    @Transactional
    public BookingDto reject(UUID ownerId, UUID bookingId) {
        Booking booking = ownerBooking(ownerId, bookingId);
        requireStatus(booking, BookingStatus.PENDING);
        releaseHold(booking, Type.RELEASE);
        booking.setStatus(BookingStatus.REJECTED);
        return BookingDto.fromEntity(booking);
    }

    @Override
    @Transactional
    public BookingDto complete(UUID userId, UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));
        if (!booking.getBuyer().getId().equals(userId) && !booking.getSkillOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException("Booking not found: " + bookingId);
        }
        requireStatus(booking, BookingStatus.ACCEPTED);

        Wallet buyerWallet = walletFor(booking.getBuyer().getId());
        Wallet ownerWallet = walletFor(booking.getSkillOwner().getId());
        if (buyerWallet.getHeldBalance() < booking.getPrice()) {
            throw new BookingConflictException("Booking hold is missing");
        }
        buyerWallet.setHeldBalance(buyerWallet.getHeldBalance() - booking.getPrice());
        ownerWallet.setBalance(ownerWallet.getBalance() + booking.getPrice());
        addTransaction(buyerWallet, Type.RELEASE, booking.getPrice(), buyerWallet.getBalance());
        addTransaction(ownerWallet, Type.EARN, booking.getPrice(), ownerWallet.getBalance());
        booking.setStatus(BookingStatus.COMPLETED);
        return BookingDto.fromEntity(booking);
    }

    @Override
    @Transactional
    public BookingDto cancel(UUID buyerId, UUID bookingId) {
        Booking booking = bookingRepository.findByIdAndBuyerId(bookingId, buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BookingConflictException("Only pending bookings can be cancelled");
        }
        releaseHold(booking, Type.REFUND);
        booking.setStatus(BookingStatus.CANCELLED);
        return BookingDto.fromEntity(booking);
    }

    private Booking ownerBooking(UUID ownerId, UUID bookingId) {
        return bookingRepository.findByIdAndSkillOwnerId(bookingId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));
    }

    private Wallet walletFor(UUID userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userId));
    }

    private void hold(Wallet wallet, long amount) {
        if (amount <= 0 || wallet.getBalance() < amount) {
            throw new BookingConflictException("Insufficient wallet balance");
        }
        wallet.setBalance(wallet.getBalance() - amount);
        wallet.setHeldBalance(wallet.getHeldBalance() + amount);
    }

    private void releaseHold(Booking booking, Type type) {
        Wallet wallet = walletFor(booking.getBuyer().getId());
        if (wallet.getHeldBalance() < booking.getPrice()) {
            throw new BookingConflictException("Booking hold is missing");
        }
        wallet.setBalance(wallet.getBalance() + booking.getPrice());
        wallet.setHeldBalance(wallet.getHeldBalance() - booking.getPrice());
        addTransaction(wallet, type, booking.getPrice(), wallet.getBalance());
    }

    private void addTransaction(Wallet wallet, Type type, long amount, long balanceAfter) {
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setBalanceAfter(balanceAfter);
        wallet.getTransactions().add(transaction);
    }

    private void requireStatus(Booking booking, BookingStatus expected) {
        if (booking.getStatus() != expected) {
            throw new BookingConflictException("Booking must be " + expected);
        }
    }

    private String normalizeDescription(String description) {
        return description == null || description.isBlank() ? null : description.trim();
    }
}
