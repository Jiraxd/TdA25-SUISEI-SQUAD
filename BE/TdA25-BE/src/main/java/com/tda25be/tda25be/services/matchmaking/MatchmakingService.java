package com.tda25be.tda25be.services.matchmaking;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
@RequiredArgsConstructor
@Service
public abstract class MatchmakingService {
    protected final Set<User> matchmakingUsers = ConcurrentHashMap.newKeySet();
    protected final WebSocketUtil webSocketUtil;
    protected final LiveGameRepo liveGameRepo;

    public static MatchmakingTypes getMatchmakingType(MatchmakingService service){
        if(service instanceof RankedMatchmakingService){
            return MatchmakingTypes.ranked;
        }
        else if(service instanceof UnrankedMatchmakingService){
            return MatchmakingTypes.unranked;
        }
        return null;
    }

    public void joinMatchmaking(User user) {
        matchmakingUsers.add(user);
    }

    public void leaveMatchmaking(User user) {
        if(!isUserMatchmaking(user)) return;
        matchmakingUsers.remove(user);
    }

    public boolean isUserMatchmaking(User user) {
        return matchmakingUsers.contains(user);
    }

    public void matchmake(User user) {
        User opponent = findMatch(user);
        if (opponent != null) {
            matchmakingUsers.remove(user);
            matchmakingUsers.remove(opponent);
            LiveGame liveGame = new LiveGame(getMatchmakingType(this));
            if(Math.round(Math.random()) != 0){
                liveGame.setPlayerO(opponent).setPlayerX(user);
            }
            else{
                liveGame.setPlayerO(user).setPlayerX(opponent);
            }
            notifyPlayers(user, opponent, liveGame);
        }
    }

    private void notifyPlayers(User user, User opponent, LiveGame liveGame) {
        webSocketUtil.sendMessageToUser(user.getUuid(), "/user/matchmaking", "MatchFound", liveGame.getUuid(), HttpStatus.OK);
        webSocketUtil.sendMessageToUser(opponent.getUuid(), "/user/matchmaking", "MatchFound", liveGame.getUuid(), HttpStatus.OK); //TODO goofy
    }

    protected abstract boolean isValidMatch(User user, User opponent);

    protected User findMatch(User user) {
        Iterator<User> iterator = matchmakingUsers.iterator();
        while (iterator.hasNext()) {
            User opponent = iterator.next();
            if (!opponent.equals(user) && isValidMatch(user, opponent)) {
                return opponent;
            }
        }
        return null;
    }
}