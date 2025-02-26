package com.tda25be.tda25be.models;

import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PrivateGameJoinedResponse {
    public PrivateGameJoinedResponse(LiveGame liveGame, User user, String token){
        this.liveGame = liveGame;
        this.user = user;
        this.token = token;
    }
    LiveGame liveGame;
    User user;
    String token;
}
