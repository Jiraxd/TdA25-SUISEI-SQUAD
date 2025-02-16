package com.tda25be.tda25be.api;

import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.error.SemanticErrorException;
import com.tda25be.tda25be.models.Move;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import jakarta.servlet.http.HttpSession;
import org.apache.coyote.BadRequestException;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.net.http.HttpHeaders;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Controller
public class LiveGameController{
    private final LiveGameRepo liveGameRepo;
    private final AuthController authController;
    private final SimpMessagingTemplate messagingTemplate;

    private void sendMessageToBothPlayers(LiveGame liveGame, String type, String message, HttpStatus httpstatus) {

        sendMessageToUser(liveGame.getUser().get(0).getUuid(), type, message, httpstatus);
        sendMessageToUser(liveGame.getUser().get(1).getUuid(), type, message, httpstatus);
    }
    private void sendMessageToUser(String uuid, String type, String message, HttpStatus status) {
        Map<String, String> payload = new HashMap<>();
        payload.put("type", type);
        payload.put("message", message);
        ResponseEntity<Map<String, String>> responseEntity = new ResponseEntity<>(payload, status);
        messagingTemplate.convertAndSendToUser(uuid, "/user/game-updates", responseEntity);

    }

    public LiveGameController(LiveGameRepo liveGameRepo, AuthController authController, SimpMessagingTemplate template) {
        this.messagingTemplate = template;
        this.liveGameRepo = liveGameRepo;
        this.authController = authController;
    }

    @MessageMapping()
    public void makeMove(@Payload Move move, Principal principal){
        LiveGame liveGame = liveGameRepo.getReferenceById(move.gameId);
        if(principal == null) return;
        User user = authController.verify(principal.getName()).getBody();
        if(liveGame.getUser().contains(user)) {
            try {
                Boolean placeO = liveGame.getPlayerO().equals(user);
                liveGame.getBoard().playMove(move.x,move.y, placeO);
                if(liveGame.getBoard().getState() == GameState.completed){//TODO implement completed
                    messagingTemplate.convertAndSendToUser(user.getUuid(), "/queue/game-updates", "Win " + user.getUuid());
                    //TODO elo?
                }
                else{
                    sendMessageToBothPlayers(liveGame, "Board", liveGame.getBoard().board.toString(), HttpStatus.OK);
                }
            } catch (BadRequestException | SemanticErrorException e) {
                sendMessageToBothPlayers(liveGame,"Error", e.getMessage(), HttpStatus.BAD_REQUEST);

            }
        }

    }

}
