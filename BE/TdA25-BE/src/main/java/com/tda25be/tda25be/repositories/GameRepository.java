package com.tda25be.tda25be.repositories;

import com.tda25be.tda25be.entities.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, String> {

}

