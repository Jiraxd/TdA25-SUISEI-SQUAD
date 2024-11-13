package com.tda25be.tda25be.repositories;

import com.tda25be.tda25be.entities.GameEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<GameEntity, String> {

}
