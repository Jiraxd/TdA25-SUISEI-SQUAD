package com.tda25be.tda25be.api;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.error.SemanticErrorException;
import com.tda25be.tda25be.models.Move;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import com.tda25be.tda25be.security.UserPrincipal;
import com.tda25be.tda25be.services.auth.AuthService;
import com.tda25be.tda25be.services.liveGameService.LiveGameService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Objects;

@RequiredArgsConstructor
@Controller("/api/v1")
public class LiveGameWsController {
    private final LiveGameRepo liveGameRepo;
    private final WebSocketUtil webSocketUtil;
    private final AuthService authService;
    private final LiveGameService liveGameService;

    @MessageMapping("/makeMove")
    public void makeMove(@Payload Move move, @AuthenticationPrincipal Principal principal) {
        if(principal == null) return;
        if(!(principal instanceof UserPrincipal userPrincipal)) return;
        User user = authService.verify(userPrincipal.getToken());
        if(user == null) return;
        LiveGame liveGame = liveGameRepo.findLiveGameByUserAndInProgress(user);
        if(liveGame == null) {
            sendError("Player isnt in a game", user);
            return;
        }
        boolean userInGame = liveGame.getUsers().stream().anyMatch((user1 -> Objects.equals(user.getUuid(), user1.getUuid())));
        if(userInGame) {
            try {
                boolean placeO = liveGame.getPlayerO().getUuid().equals(user.getUuid());
                if(liveGame.getBoard().isOTurn() != placeO) {
                    throw new BadRequestException("Its not your turn");
                }
                liveGame.updateTime();
                if(liveGame.getPlayerOTime() <= 0){
                    liveGame.setPlayerOTime(0L);
                    liveGameService.win(liveGame, "X");
                    return;
                }
                else if(liveGame.getPlayerXTime() <= 0){
                    liveGame.setPlayerXTime(0L);
                    liveGameService.win(liveGame, "O");
                    return;
                }
                liveGame.getBoard().playMove(move.x,move.y, placeO);
                if(liveGame.getBoard().getState() == GameState.completed){
                    if(placeO) liveGameService.win(liveGame, "O");
                    else liveGameService.win(liveGame, "X");
                }
                else{
                    liveGameRepo.saveAndFlush(liveGame);
                    webSocketUtil.sendMessageToUsers(liveGame.getUsers(), "/queue/game-updates","Update", liveGame.getBoard().board.toString(), HttpStatus.OK);
                }
            } catch (BadRequestException | SemanticErrorException e) {
                sendError(e.getMessage(), user);
            }
        }
    }

    private void sendError(String message, User user) {
        webSocketUtil.sendMessageToUser(user.getUuid(), "/queue/game-updates","Error", message, HttpStatus.BAD_REQUEST);
    }

}
