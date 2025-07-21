package com.example.cardapi.controller;
import com.example.cardapi.model.Card;
import com.example.cardapi.service.CardService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "*")
public class CardController {
    private final CardService service;
    public CardController(CardService service) {
        this.service = service;
    }
    @PostMapping("/add")
    public Card create(@RequestBody Card rawCard) {
        return service.create(rawCard);
    }
    @GetMapping
    public List<Card> getAll() {
        return service.findAll();
    }
    @GetMapping("/{id}")
    public Card getOne(@PathVariable Long id) {
        return service.findById(id);
    }
    @PutMapping("/{id}")
    public Card update(@PathVariable Long id, @RequestBody Card card) {
        return service.update(id, card);
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
