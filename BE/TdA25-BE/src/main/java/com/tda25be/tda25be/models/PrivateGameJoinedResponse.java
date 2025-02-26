package com.tda25be.tda25be.models;

import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class PrivateGameJoinedResponse {
    LiveGame liveGame;
    User user;
}
