package com.tda25be.tda25be.repositories;

import com.tda25be.tda25be.entities.LiveGame;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LiveGameRepo extends JpaRepository<LiveGame, String> {
}
