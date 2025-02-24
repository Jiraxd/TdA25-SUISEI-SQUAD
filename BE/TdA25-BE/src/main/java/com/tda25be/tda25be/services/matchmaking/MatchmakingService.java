package com.tda25be.tda25be.services.matchmaking;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.enums.MatchmakingTypes;
import com.tda25be.tda25be.models.UserWithTimeStamp;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class MatchmakingService {
    protected final Set<UserWithTimeStamp> matchmakingUsers = ConcurrentHashMap.newKeySet();
    protected final WebSocketUtil webSocketUtil;
    private final LiveGameRepo liveGameRepo;
    private final Boolean ranked;

    public MatchmakingService(WebSocketUtil webSocketUtil, LiveGameRepo liveGameRepo, Boolean ranked) {
        this.webSocketUtil = webSocketUtil;
        this.liveGameRepo = liveGameRepo;
        this.ranked = ranked;
    }

    public void joinMatchmaking(User user) {
        matchmakingUsers.add(new UserWithTimeStamp(user));
    }

    public void leaveMatchmaking(User user) {
        if(!isUserMatchmaking(user)) return;
        matchmakingUsers.removeIf(userWithTimeStamp -> userWithTimeStamp.user.equals(user));
    }

    public boolean isUserMatchmaking(User user) {
        return matchmakingUsers.stream()
                .anyMatch(matchmakingUser -> matchmakingUser.user.getUuid().equals(user.getUuid()));
    }

    @Scheduled(fixedDelay = 5000)
    public void matchmake() {
        User player1;
        User player2;

        List<UserWithTimeStamp> userList = new ArrayList<>(matchmakingUsers);

        userList.sort((UserWithTimeStamp user1, UserWithTimeStamp user2) -> {
            if (user1.user.getElo() < user2.user.getElo()) return -1;
            if (user1.user.getElo() > user2.user.getElo()) return 1;
            return Long.compare(user1.timestamp, user2.timestamp);
        });

        while (userList.size() >= 2) {
            player1 = userList.get(0).user;
            player2 = userList.get(1).user;

            matchmakingUsers.remove(userList.get(0));
            matchmakingUsers.remove(userList.get(1));
            userList.remove(0);
            userList.remove(0);

            LiveGame liveGame = new LiveGame(ranked ? MatchmakingTypes.ranked : MatchmakingTypes.unranked);
            if (Math.round(Math.random()) != 0) {
                liveGame.setPlayerO(player2).setPlayerX(player1);
            } else {
                liveGame.setPlayerO(player1).setPlayerX(player2);
            }
            liveGameRepo.save(liveGame);
            notifyPlayers(player1, player2, liveGame);
        }
    }

    private void notifyPlayers(User user, User opponent, LiveGame liveGame) {
        webSocketUtil.sendMessageToUser(user.getUuid(),  "/queue/matchmaking", "MatchFound", liveGame.getUuid(), HttpStatus.OK);
        webSocketUtil.sendMessageToUser(opponent.getUuid(), "/queue/matchmaking", "MatchFound", liveGame.getUuid(), HttpStatus.OK);
    }
}