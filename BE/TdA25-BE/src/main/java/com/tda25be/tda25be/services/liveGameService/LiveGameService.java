package com.tda25be.tda25be.services.liveGameService;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.enums.EloGameState;
import com.tda25be.tda25be.enums.MatchmakingTypes;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
@RequiredArgsConstructor
@Service
public class LiveGameService {
    private final LiveGameRepo liveGameRepo;
    private final WebSocketUtil webSocketUtil;

    public void win(LiveGame liveGame, String symbolWin) {
        User winner = Objects.equals(symbolWin, "X") ? liveGame.getPlayerX() : liveGame.getPlayerO();
        User loser = Objects.equals(symbolWin, "X") ? liveGame.getPlayerO() : liveGame.getPlayerX();
        if(liveGame.getMatchmakingType() == MatchmakingTypes.ranked) evalMatch(winner, loser, false);
        liveGame.setFinished(true).setPlayerXEloAfter(liveGame.getPlayerX().getElo()).setPlayerOEloAfter(liveGame.getPlayerO().getElo());
        liveGameRepo.saveAndFlush(liveGame);
        webSocketUtil.sendMessageToUser(winner.getUuid(), "/queue/game-updates", "End", symbolWin, HttpStatus.OK);
        webSocketUtil.sendMessageToUser(loser.getUuid(), "/queue/game-updates", "End", symbolWin, HttpStatus.OK);
    }
    public void draw(LiveGame liveGame) {
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
    public void modifyElo(User player, double Ea, EloGameState state){
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
            if(liveGame.getFinished()) continue;
            liveGame.updateTime();
            if(liveGame.getPlayerOTime()< 0){
                win(liveGame, "X");
            }
            if(liveGame.getPlayerXTime()< 0){
                win(liveGame, "O");
            }
        }
    }

}
