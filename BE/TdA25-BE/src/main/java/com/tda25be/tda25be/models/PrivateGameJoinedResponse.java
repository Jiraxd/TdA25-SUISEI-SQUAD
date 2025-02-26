package com.tda25be.tda25be.models;

import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class PrivateGameJoinedResponse {
    LiveGame liveGame;
    User user;
    String token;
}
