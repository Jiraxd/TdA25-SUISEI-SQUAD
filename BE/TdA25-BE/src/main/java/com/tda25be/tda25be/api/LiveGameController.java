package com.tda25be.tda25be.api;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.error.SemanticErrorException;
import com.tda25be.tda25be.models.Move;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import com.tda25be.tda25be.repositories.UserRepo;
import com.tda25be.tda25be.services.auth.AuthService;
import com.tda25be.tda25be.services.matchmaking.MatchmakingService;
import com.tda25be.tda25be.services.matchmaking.MatchmakingTypes;
import com.tda25be.tda25be.services.matchmaking.RankedMatchmakingService;
import com.tda25be.tda25be.services.matchmaking.UnrankedMatchmakingService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RequiredArgsConstructor
@Controller
public class LiveGameController{
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
                    webSocketUtil.sendMessageToUser(user.getUuid(), "/user/game-updates", "Win", user.getUuid(), HttpStatus.OK);
                }
                else{
                    webSocketUtil.sendMessageToUsers(liveGame.getUsers(), "/user/game-updates","Board", liveGame.getBoard().board.toString(), HttpStatus.OK);
                }
            } catch (BadRequestException | SemanticErrorException e) {
                webSocketUtil.sendMessageToUser(user.getUuid(), "/user/game-updates","Error", e.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }

    }


}
