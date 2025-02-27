package com.tda25be.tda25be.services.matchmaking;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.enums.MatchmakingTypes;
import com.tda25be.tda25be.models.IncompletePracticeGame;
import com.tda25be.tda25be.models.PrivateGameJoinedResponse;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import com.tda25be.tda25be.repositories.SessionRepo;
import com.tda25be.tda25be.repositories.UserRepo;
import com.tda25be.tda25be.services.auth.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PracticeGameService {
    private final ConcurrentHashMap<String, String> codeAndUuidRelation = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, IncompletePracticeGame> privateGames = new ConcurrentHashMap<>();
    private final WebSocketUtil webSocketUtil;
    private final AuthService authService;
    private final UserRepo userRepo;
    private final LiveGameRepo liveGameRepo;
    private final SessionRepo sessionRepo;

    public PracticeGameService(WebSocketUtil webSocketUtil, AuthService authService, UserRepo userRepo, LiveGameRepo liveGameRepo, SessionRepo sessionRepo) {
        this.webSocketUtil = webSocketUtil;
        this.authService = authService;
        this.userRepo = userRepo;
        this.liveGameRepo = liveGameRepo;
        this.sessionRepo = sessionRepo;
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
        practiceGame.setCode(code);
        privateGames.put(uuid, practiceGame);
        return practiceGame;
    }

    public PrivateGameJoinedResponse acceptMatch(String uuid, String token){
        Optional<LiveGame> possibleLiveGame = liveGameRepo.findById(uuid);
        if( possibleLiveGame.isPresent()) {
            LiveGame liveGame = possibleLiveGame.get();

            
            User found = authService.verify(token);


        if(found != null){


            if(liveGame.getPlayerX().getUuid().equals(found.getUuid()) || liveGame.getPlayerO().getUuid().equals(found.getUuid()))


                return new PrivateGameJoinedResponse(liveGame,found, token);


        } 
            if(liveGame.getPlayerO().getEmail() == null || liveGame.getPlayerO().getEmail().isEmpty()){
                List<Session> sessions = sessionRepo.findByUser(liveGame.getPlayerO());
                Session session = new Session();
                if(sessions.isEmpty()){
                    session.user = liveGame.getPlayerO();
                    session.setDeviceName("temp");
                }else {
                    session = sessions.get(0);
                }
                return new PrivateGameJoinedResponse(liveGame, liveGame.getPlayerO(), session.getToken());
            }
            else if(liveGame.getPlayerX().getEmail() == null || liveGame.getPlayerX().getEmail().isEmpty()){
                List<Session> sessions = sessionRepo.findByUser(liveGame.getPlayerX());
                Session session = new Session();
                if(sessions.isEmpty()){
                    session.user = liveGame.getPlayerX();
                    session.setDeviceName("temp");
                }else {
                    session = sessions.get(0);
                }
                return new PrivateGameJoinedResponse(liveGame, liveGame.getPlayerX(), session.getToken());
            }
        }
        IncompletePracticeGame practiceGame = privateGames.get(uuid);
        if(practiceGame == null) {
            System.out.println("N1");
            return null;
        }
        User user = practiceGame.getUser();
        if(authService.verify(token) != null && authService.verify(token).getUuid().equals(user.getUuid())){
            return new PrivateGameJoinedResponse(liveGameRepo.getLiveGameByUuid(uuid),user, token);
        }
        User tempUser = token == null || token.isEmpty() ? createTempUser() : authService.verify(token);
        if(tempUser == null) tempUser = createTempUser();

        LiveGame newLiveGame = new LiveGame(MatchmakingTypes.unranked);
        if(Objects.equals(practiceGame.getSymbol(), "X")) newLiveGame.setPlayerX(user).setPlayerXEloBefore(user.getElo()).setPlayerOEloBefore(tempUser.getElo()).setPlayerO(tempUser);
        else newLiveGame.setPlayerX(tempUser).setPlayerXEloBefore(tempUser.getElo()).setPlayerOEloBefore(user.getElo()).setPlayerO(user);
        newLiveGame.setUuid(uuid);
        if(practiceGame.getTimeLimit() != 0) {
            newLiveGame.setPlayerXTime(practiceGame.getTimeLimit()*1000);
            newLiveGame.setPlayerOTime(practiceGame.getTimeLimit()*1000);
        }
        else {
            newLiveGame.setPlayerXTime(1000000000L);
            newLiveGame.setPlayerOTime(1000000000L);
        }
        liveGameRepo.saveAndFlush(newLiveGame);
        privateGames.remove(uuid);
        Session session = new Session();
        session.user = tempUser;
        session.setDeviceName("temp");
        sessionRepo.saveAndFlush(session);
        webSocketUtil.sendMessageToUser(user.getUuid(),  "/queue/matchmaking", "MatchFound", uuid, HttpStatus.OK);
        return new PrivateGameJoinedResponse(newLiveGame, tempUser, session.getToken());
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
    public User createTempUser(){
        User tempUser = new User();
        Random r = new Random(System.currentTimeMillis());
        String username;
        do {
            username = "Guest" + r.nextInt(0, 1000000);
        }while (userRepo.findByUsername(username) != null);
        tempUser.setUsername(username);
        userRepo.saveAndFlush(tempUser);
        return tempUser;
    }

    public String getUuidFromCode(String code){
        return codeAndUuidRelation.get(code);
    }

    @Scheduled(fixedDelay = 60000)
    private void removePrivateGames(){
        List<String> toRemove = new ArrayList<>();
        privateGames.forEach((uuid, incompletePracticeGame) -> {
            if(System.currentTimeMillis() - incompletePracticeGame.getCreationTime() > 600000) toRemove.add(uuid);
        });
        toRemove.forEach(privateGames::remove);
    }
}
