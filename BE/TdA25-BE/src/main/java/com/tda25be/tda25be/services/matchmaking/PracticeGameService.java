package com.tda25be.tda25be.services.matchmaking;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.enums.MatchmakingTypes;
import com.tda25be.tda25be.models.IncompletePracticeGame;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PracticeGameService {
    private final ConcurrentHashMap<String, String> codeAndUuidRelation = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, IncompletePracticeGame> privateGames = new ConcurrentHashMap<>();
    private final WebSocketUtil webSocketUtil;

    public PracticeGameService(WebSocketUtil webSocketUtil) {
        this.webSocketUtil = webSocketUtil;
    }

    public IncompletePracticeGame createRequest(User user, String symbol, Long timeLimit){
        if(user == null) return null;
        String uuid = "PRIVATE_" + UUID.randomUUID();
        String code = generateRandomCode();
        codeAndUuidRelation.put(code, uuid);
        IncompletePracticeGame practiceGame = new IncompletePracticeGame();
        practiceGame.setSymbol(symbol);
        practiceGame.setUser(user);
        practiceGame.setUuid(uuid);
        practiceGame.setTimeLimit(timeLimit);

        privateGames.put(uuid, practiceGame);
        return practiceGame;
    }
    public String getUuidFromCode(String code){
        return codeAndUuidRelation.get(code);
    }
    public String acceptMatch(String uuid){
        IncompletePracticeGame practiceGame = privateGames.get(uuid);
        if(practiceGame == null) return null;
        User user = practiceGame.getUser();
        User tempUser = null;
        LiveGame newLiveGame = new LiveGame(MatchmakingTypes.unranked);
        if(practiceGame.getSymbol() == "X") newLiveGame.setPlayerX(user).setPlayerXEloBefore(user.getElo()).setPlayerOEloBefore(0).setPlayerO(tempUser);
        else newLiveGame.setPlayerX(tempUser).setPlayerXEloBefore(0).setPlayerOEloBefore(user.getElo()).setPlayerO(user);
        newLiveGame.setUuid(uuid);
        newLiveGame.setPlayerXTime(practiceGame.getTimeLimit());
        newLiveGame.setPlayerXTime(practiceGame.getTimeLimit());
        webSocketUtil.sendMessageToUser(user.getUuid(),  "/queue/game-updates", "MatchFound", uuid, HttpStatus.OK);
        return uuid;
    }//TODO scheduled deletion

    public static String generateRandomCode() {
        final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        final int CODE_LENGTH = 10;
        SecureRandom random = new SecureRandom();
        StringBuilder code = new StringBuilder(CODE_LENGTH);

        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            code.append(CHARACTERS.charAt(index));
        }
        return code.toString();
    }

}
