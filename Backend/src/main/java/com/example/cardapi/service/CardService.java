package com.example.cardapi.service;

import com.example.cardapi.model.Card;
import com.example.cardapi.repository.CardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class CardService {

    private final CardRepository repo;

    public CardService(CardRepository repo) {
        this.repo = repo;
    }

    /* ---------- CREATE ---------- */
    public Card create(Card cardRaw) {

        // — Required‑field validation only —
        if (cardRaw.getCardNumber() == null || cardRaw.getCardNumber().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Card number is required");
        }
        if (cardRaw.getCardholderName() == null || cardRaw.getCardholderName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cardholder name is required");
        }
        if (cardRaw.getExpiryMonth() == 0 || cardRaw.getExpiryYear() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expiry month and year are required");
        }
        if (cardRaw.getCvv() == null || cardRaw.getCvv().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CVV is required");
        }

        // Mask sensitive info before saving
        String number = cardRaw.getCardNumber().replaceAll("\\s+", "");
        if (number.length() >= 8) {
            cardRaw.setCardNumber(
                    number.substring(0, 4) + "********" + number.substring(number.length() - 4)
            );
        }
        cardRaw.setCvv("***");

        return repo.save(cardRaw);
    }

    /* ---------- READ ---------- */
    public List<Card> findAll() {
        return repo.findAll();
    }

    public Card findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found"));
    }

    /* ---------- UPDATE ---------- */
    public Card update(Long id, Card updated) {
        Card existing = findById(id);

        if (updated.getCardholderName() != null && !updated.getCardholderName().isBlank()) {
            existing.setCardholderName(updated.getCardholderName());
        }
        if (updated.getExpiryMonth() != 0 && updated.getExpiryYear() != 0) {
            existing.setExpiryMonth(updated.getExpiryMonth());
            existing.setExpiryYear(updated.getExpiryYear());
        }

        return repo.save(existing);
    }

    /* ---------- DELETE ---------- */
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
