package com.example.cardapi.repository;
import com.example.cardapi.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface CardRepository extends JpaRepository<Card, Long> {}
