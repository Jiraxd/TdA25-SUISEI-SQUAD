package com.tda25be.tda25be.services.matchmaking;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.concurrent.ConcurrentHashMap;
@RequiredArgsConstructor
@Service
public class RematchService {
    private final ConcurrentHashMap<String, User> requestingRematch = new ConcurrentHashMap<>();
    private final LiveGameRepo liveGameRepo;
    private final WebSocketUtil webSocketUtil;

    public void requestRematch(User user, String uuid){
        if(user == null) return;
        User opponent = requestingRematch.get(uuid);
        LiveGame liveGame = liveGameRepo.getReferenceById(uuid);
        if(opponent == null){
            requestingRematch.put(uuid, user);
        }
        else{
            requestingRematch.remove(uuid);
            LiveGame newLiveGame = new LiveGame(liveGame.getMatchmakingType());
            if (Math.round(Math.random()) != 0) {
                newLiveGame.setPlayerO(user).setPlayerX(opponent).setPlayerOEloBefore(user.getElo()).setPlayerXEloBefore (opponent.getElo());
            } else {
                newLiveGame.setPlayerO(opponent).setPlayerX(user).setPlayerOEloBefore(opponent.getElo()).setPlayerXEloBefore(user.getElo());
            }
            notifyPlayers(user, opponent, liveGame);
        }
    }
    public void rejectRematch(User user, String uuid){
        if(user == null) return;
        if(requestingRematch.containsKey(uuid)){
            User opponent = requestingRematch.get(uuid);
            webSocketUtil.sendMessageToUser(opponent.getUuid(),  "/queue/game-updates", "RejectRematch", "", HttpStatus.OK);
        }
        requestingRematch.remove(uuid);
    }
    private void notifyPlayers(User user, User opponent, LiveGame liveGame) {
        webSocketUtil.sendMessageToUser(user.getUuid(),  "/queue/game-updates", "MatchFound", liveGame.getUuid(), HttpStatus.OK);
        webSocketUtil.sendMessageToUser(opponent.getUuid(), "/queue/game-updates", "MatchFound", liveGame.getUuid(), HttpStatus.OK);
    }

}
