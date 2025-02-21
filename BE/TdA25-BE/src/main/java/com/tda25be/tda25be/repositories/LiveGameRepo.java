package com.tda25be.tda25be.repositories;

import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LiveGameRepo extends JpaRepository<LiveGame, String> {
    @Query("SELECT lg FROM LiveGame lg WHERE :user = lg.playerO OR :user = lg.playerX")
    LiveGame findLiveGameByUser(@NonNull User user);
    @Query("SELECT lg FROM LiveGame lg WHERE :userId = lg.playerO.uuid OR :userId = lg.playerX.uuid")
    List<LiveGame> findLiveGameByUserId(@NonNull String userId);
}
