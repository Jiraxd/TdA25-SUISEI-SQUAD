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
import com.tda25be.tda25be.security.UserPrincipal;
import com.tda25be.tda25be.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.List;
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
                if(liveGame.getPlayerOTime() < 0){
                    win(liveGame, "X");
                    return;
                }
                else if(liveGame.getPlayerXTime() < 0){
                    win(liveGame, "O");
                    return;
                }
                liveGame.getBoard().playMove(move.x,move.y, placeO);
                liveGameRepo.save(liveGame);
                if(liveGame.getBoard().getState() == GameState.completed){
                    if(placeO) win(liveGame, "O");
                    else win(liveGame, "X");
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

    private void win(LiveGame liveGame, String symbolWin) {
        User winner = Objects.equals(symbolWin, "X") ? liveGame.getPlayerX() : liveGame.getPlayerO();
        User loser = Objects.equals(symbolWin, "X") ? liveGame.getPlayerO() : liveGame.getPlayerX();
        evalMatch(winner, loser, false);
        liveGame.setFinished(true).setPlayerXEloAfter(liveGame.getPlayerX().getElo()).setPlayerOEloAfter(liveGame.getPlayerO().getElo());
        liveGameRepo.saveAndFlush(liveGame);
        webSocketUtil.sendMessageToUser(winner.getUuid(), "/queue/game-updates", "End", "", HttpStatus.OK);
        webSocketUtil.sendMessageToUser(loser.getUuid(), "/queue/game-updates", "End", "", HttpStatus.OK);
    }
    private void draw(LiveGame liveGame) {
        liveGame.setFinished(true).setPlayerXEloAfter(liveGame.getPlayerX().getElo()).setPlayerOEloAfter(liveGame.getPlayerO().getElo());
        evalMatch(liveGame.getPlayerX(), liveGame.getPlayerO(), true);
        liveGameRepo.saveAndFlush(liveGame);
        webSocketUtil.sendMessageToUser(liveGame.getPlayerX().getUuid(), "/queue/game-updates", "End", "Draw", HttpStatus.OK);
        webSocketUtil.sendMessageToUser(liveGame.getPlayerO().getUuid(), "/queue/game-updates", "End", "Draw", HttpStatus.OK);
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
        playerWR = Double.isNaN(playerWR) ? 0 : playerWR;
        double score = switch (state) {
            case win -> 1;
            case loss -> 0;
            case draw -> 0.5;
        };
        playerElo = playerElo + 40*(score - Ea)*(1+0.5*(0.5-playerWR));
        player.setElo((int) Math.ceil(playerElo));
    }
    @Scheduled(fixedDelay = 5000)
    private void checkTimeOut(){
        List<LiveGame> liveGames = liveGameRepo.findAll();
        for(LiveGame liveGame : liveGames){
            if(liveGame.getBoard().isOTurn() && liveGame.getPlayerOTime() < System.currentTimeMillis()- liveGame.getLastTimeUpdateAt()){
                win(liveGame, "X");
            }
            else if(!liveGame.getBoard().isOTurn() && liveGame.getPlayerXTime() < System.currentTimeMillis()- liveGame.getLastTimeUpdateAt()){
                win(liveGame, "O");
            }
        }
    }
}
