package com.tda25be.tda25be.services.liveGameService;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.enums.EloGameState;
import com.tda25be.tda25be.enums.MatchmakingTypes;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import com.tda25be.tda25be.repositories.SessionRepo;
import com.tda25be.tda25be.repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.xml.crypto.dsig.keyinfo.KeyValue;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Service
public class LiveGameService {
    private final LiveGameRepo liveGameRepo;
    private final WebSocketUtil webSocketUtil;
    private final UserRepo userRepo;
    private final SessionRepo sessionRepo;
    private final List<User> requestingDraw = new ArrayList<>();
    private final ConcurrentHashMap<String, LocalDateTime> lastRequests = new ConcurrentHashMap<>();

    public void win(LiveGame liveGame, String symbolWin) {
        User winner = Objects.equals(symbolWin, "X") ? liveGame.getPlayerX() : liveGame.getPlayerO();
        User loser = Objects.equals(symbolWin, "X") ? liveGame.getPlayerO() : liveGame.getPlayerX();
        requestingDraw.removeIf(userRequesting -> userRequesting.getUuid().equals(loser.getUuid()));
        requestingDraw.removeIf(userRequesting -> userRequesting.getUuid().equals(winner.getUuid()));
        winner.setWins(winner.getWins() + 1);
        loser.setLosses(loser.getLosses() + 1);
        if(liveGame.getMatchmakingType() == MatchmakingTypes.ranked) evalMatch(winner, loser, false);
        liveGame.setFinished(true).setPlayerXEloAfter(liveGame.getPlayerX().getElo()).setPlayerOEloAfter(liveGame.getPlayerO().getElo());
        liveGameRepo.saveAndFlush(liveGame);
        webSocketUtil.sendMessageToUser(winner.getUuid(), "/queue/game-updates", "End", symbolWin, HttpStatus.OK);
        webSocketUtil.sendMessageToUser(loser.getUuid(), "/queue/game-updates", "End", symbolWin, HttpStatus.OK);
    }
    public void draw(LiveGame liveGame) {
        liveGame.setFinished(true).setPlayerXEloAfter(liveGame.getPlayerX().getElo()).setPlayerOEloAfter(liveGame.getPlayerO().getElo());
        User player1 = liveGame.getPlayerX();
        User player2 = liveGame.getPlayerO();
        requestingDraw.removeIf(userRequesting -> userRequesting.getUuid().equals(player2.getUuid()));
        requestingDraw.removeIf(userRequesting -> userRequesting.getUuid().equals(player1.getUuid()));
        player1.setDraws(player1.getDraws() + 1);
        player2.setDraws(player2.getDraws() + 1);
        evalMatch(player1, player2, true);
        liveGameRepo.saveAndFlush(liveGame);
        webSocketUtil.sendMessageToUser(player2.getUuid(), "/queue/game-updates", "End", "Draw", HttpStatus.OK);
        webSocketUtil.sendMessageToUser(player1.getUuid(), "/queue/game-updates", "End", "Draw", HttpStatus.OK);
    }

    public void evalMatch(User winner, User loser, boolean draw){
        int winnerElo = winner.getElo();
        int loserElo = loser.getElo();
        double winnerEa = 1/(1+Math.pow(10, (double) (loserElo - winnerElo) /400));
        double loserEa = 1-winnerEa;
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
        player.setElo(Math.max(0, (int) Math.ceil(playerElo)));
        userRepo.save(player);
    }
    public Boolean requestDraw(User user){
        LiveGame liveGame = liveGameRepo.findLiveGameByUserAndInProgress(user);
        User opponent = Objects.equals(liveGame.getPlayerO().getUuid(), user.getUuid()) ? liveGame.getPlayerX() : liveGame.getPlayerO();
        if(lastRequests.containsKey(user.getUuid())){
            if(LocalDateTime.now().isBefore(lastRequests.get(user.getUuid()).plusSeconds(10))) return false;
            lastRequests.remove(user.getUuid());
        }
        lastRequests.put(user.getUuid(), LocalDateTime.now());
        boolean drawGame = requestingDraw.stream().anyMatch((userD)-> Objects.equals(userD.getUuid(), opponent.getUuid()));
        if(drawGame) {
            draw(liveGame);
            requestingDraw.removeIf(userRequesting -> userRequesting.getUuid().equals(user.getUuid()));
            return true;
        }
        requestingDraw.add(user);
        webSocketUtil.sendMessageToUser(opponent.getUuid(), "/queue/game-updates", "RequestDraw", "", HttpStatus.OK);
        return true;
    }
    public void rejectDraw(User user){
        LiveGame liveGame = liveGameRepo.findLiveGameByUserAndInProgress(user);
        User opponent = Objects.equals(liveGame.getPlayerO().getUuid(), user.getUuid()) ? liveGame.getPlayerX() : liveGame.getPlayerO();
        requestingDraw.removeIf(userRequesting -> userRequesting.getUuid().equals(opponent.getUuid()));
        webSocketUtil.sendMessageToUser(opponent.getUuid(), "/queue/game-updates", "RejectDraw", "", HttpStatus.OK);
    }


    @Scheduled(fixedDelay = 5000)
    private void checkTimeOut(){
        List<LiveGame> liveGames = liveGameRepo.findAll();
        for(LiveGame liveGame : liveGames){
            if(liveGame.getFinished()) continue;
            liveGame.updateTime();
            if(liveGame.getPlayerOTime()<=0){
                liveGame.setPlayerOTime(0L);
                win(liveGame, "X");
            }
            if(liveGame.getPlayerXTime()<=0){
                liveGame.setPlayerXTime(0L);
                win(liveGame, "O");
            }
        }
    }
    @Scheduled(fixedDelay = 500) // zmen cas
    private void removeTempUsers(){
        List<User> users = userRepo.findAll();
        users.forEach((user ->  {
            if(user.getEmail() == null){
                boolean delete = true;
                List<LiveGame> liveGames = liveGameRepo.findAllByPlayerOOrPlayerX(user,user);
                for(LiveGame liveGame : liveGames){

                    if (liveGame.getFinished()) {
                        delete = false;
                        break;
                    }
                }
                if(delete){
                    List<Session> sessions = sessionRepo.findByUser(user);
                    sessionRepo.deleteAll(sessions);
                    liveGames.forEach((liveGame -> {
                        if(liveGame.getPlayerO().getUuid().equals(user.getUuid())){
                            liveGame.setPlayerO(null);
                        }
                        else {
                            liveGame.setPlayerX(null);
                        }
                    }));
                    userRepo.delete(user);
                }
            }
        }));
    }
}