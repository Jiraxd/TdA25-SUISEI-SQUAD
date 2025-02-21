package com.tda25be.tda25be.api;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.error.SemanticErrorException;
import com.tda25be.tda25be.models.Move;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import com.tda25be.tda25be.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RequiredArgsConstructor
@Controller()
public class LiveGameWsController {
    private final LiveGameRepo liveGameRepo;
    private final WebSocketUtil webSocketUtil;
    private final AuthService authService;

    @MessageMapping()
    public void makeMove(@Payload Move move, Principal principal){
        LiveGame liveGame = liveGameRepo.getReferenceById(move.gameId);
        if(principal == null) return;
        User user = authService.verify(principal.getName());
        if(liveGame.getUsers().contains(user)) {
            try {
                Boolean placeO = liveGame.getPlayerO().equals(user);
                liveGame.getBoard().playMove(move.x,move.y, placeO);
                if(liveGame.getBoard().getState() == GameState.completed){//TODO implement completed
                    webSocketUtil.sendMessageToUser(user.getUuid(), "/queue/game-updates", "Win", user.getUuid(), HttpStatus.OK);
                    //TODO elo calc
                    liveGame.setFinished(true).setPlayerXEloAfter(liveGame.getPlayerX().getElo()).setPlayerOEloAfter(liveGame.getPlayerO().getElo());

                }
                else{
                    webSocketUtil.sendMessageToUsers(liveGame.getUsers(), "/queue/game-updates","Board", liveGame.getBoard().board.toString(), HttpStatus.OK);
                }
            } catch (BadRequestException | SemanticErrorException e) {
                webSocketUtil.sendMessageToUser(user.getUuid(), "/queue/game-updates","Error", e.getMessage(), HttpStatus.BAD_REQUEST);
            }//TODO time every 5 secs
        }
    }
}
