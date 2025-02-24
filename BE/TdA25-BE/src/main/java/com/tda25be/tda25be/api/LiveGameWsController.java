package com.tda25be.tda25be.api;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.enums.EloGameState;
import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.error.SemanticErrorException;
import com.tda25be.tda25be.models.Move;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import com.tda25be.tda25be.repositories.UserRepo;
import com.tda25be.tda25be.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Objects;

@RequiredArgsConstructor
@Controller
public class LiveGameWsController {
    private final LiveGameRepo liveGameRepo;
    private final WebSocketUtil webSocketUtil;
    private final AuthService authService;
    private final UserRepo userRepo;

    @MessageMapping("/makeMove")
    public void makeMove(@Payload Move move, @AuthenticationPrincipal Principal principal) {
        if(principal == null) return;
        LiveGame liveGame = liveGameRepo.findLiveGameByUserAndInProgress(userRepo.getReferenceById(principal.getName()));
        User user = authService.verify(principal.getName());
        if(liveGame.getUsers().contains(user)) {
            try {
                Boolean placeO = liveGame.getPlayerO().equals(user);
                liveGame.getBoard().playMove(move.x,move.y, placeO);
                if(liveGame.getBoard().getState() == GameState.completed){
                    User winner = Objects.equals(liveGame.getBoard().winner, "X") ? liveGame.getPlayerX() : liveGame.getPlayerO();
                    User loser = Objects.equals(liveGame.getBoard().winner, "X") ? liveGame.getPlayerO() : liveGame.getPlayerX();
                    evalMatch(winner, loser, false);
                    liveGame.setFinished(true).setPlayerXEloAfter(liveGame.getPlayerX().getElo()).setPlayerOEloAfter(liveGame.getPlayerO().getElo());
                    webSocketUtil.sendMessageToUser(user.getUuid(), "/queue/game-updates", "Win", user.getUuid(), HttpStatus.OK);
                }
                else{
                    webSocketUtil.sendMessageToUsers(liveGame.getUsers(), "/queue/game-updates","Board", liveGame.getBoard().board.toString(), HttpStatus.OK);
                }
            } catch (BadRequestException | SemanticErrorException e) {
                webSocketUtil.sendMessageToUser(user.getUuid(), "/queue/game-updates","Error", e.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }
    }

    public void evalMatch(User winner, User loser, boolean draw){
        int winnerElo = winner.getElo();
        int loserElo = loser.getElo();
        double winnerEa = 1/(1+Math.pow(10, (double) (loserElo - winnerElo) /400));
        double loserEa =  1-winnerEa;
        if(draw){
            modifyElo(winner, winnerEa, EloGameState.draw);
            modifyElo(loser, loserEa, EloGameState.draw);
            return;
        }
        modifyElo(winner, winnerEa, EloGameState.win);
        modifyElo(loser, loserEa, EloGameState.loss);
    }
    private void modifyElo(User player, double Ea, EloGameState state){
        double playerElo = player.getElo();
        double playerWR = (double) (player.getWins() + player.getDraws()) / (player.getLosses() + player.getDraws() + player.getWins());
        double score = switch (state) {
            case win -> 1;
            case loss -> 0;
            case draw -> 0.5;
        };
        playerElo = playerElo + 40*(score - Ea)*(1+0.5*(0.5-playerWR));
        player.setElo((int) Math.ceil(playerElo));
    }
}
