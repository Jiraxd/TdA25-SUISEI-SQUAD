package com.tda25be.tda25be.api;

import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.models.Move;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.net.http.HttpHeaders;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Controller
public class LiveGameController{
    private LiveGameRepo liveGameRepo;
    private AuthController authController;
    public LiveGameController(LiveGameRepo liveGameRepo, AuthController authController) {
        this.liveGameRepo = liveGameRepo;
        this.authController = authController;
    }

    @MessageMapping
    public void makeMove(@Payload Move move, @Headers HttpHeaders headers) {
        LiveGame liveGame = liveGameRepo.getReferenceById(move.gameId);
        Optional<String> token = headers.firstValue("Authorization");
        if(token.isEmpty()) return; //TODO ERROR
        User user = authController.verify(token.get()).getBody();
        if(liveGame.getUser().contains(user)) {
            liveGame.getBoard();
        }

    }

}
