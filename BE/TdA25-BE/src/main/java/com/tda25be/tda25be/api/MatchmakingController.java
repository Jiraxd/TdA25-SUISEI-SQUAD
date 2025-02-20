package com.tda25be.tda25be.api;

import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.SessionRepo;
import com.tda25be.tda25be.repositories.UserRepo;
import com.tda25be.tda25be.services.matchmaking.MatchmakingService;
import com.tda25be.tda25be.services.matchmaking.MatchmakingTypes;
import com.tda25be.tda25be.services.matchmaking.RankedMatchmakingService;
import com.tda25be.tda25be.services.matchmaking.UnrankedMatchmakingService;
import jakarta.persistence.Convert;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/matchmaking")
public class MatchmakingController {
    private final List<MatchmakingService> matchmakingServices;
    private final SessionRepo sessionRepo;

    @GetMapping("/start")
    public ResponseEntity<String> startMatchmaking(@RequestParam MatchmakingTypes matchmaking , @RequestHeader("Authorization") String token){
        if(matchmaking == null || token == null) return ResponseEntity.badRequest().build();
        Session session = sessionRepo.findByToken(token).orElse(null);
        if(session == null || session.getUser() == null) return ResponseEntity.badRequest().build();
        User user = session.getUser();
        for (MatchmakingService matchmakingService : matchmakingServices) {
            if (matchmakingService.isUserMatchmaking(user)) {
                return ResponseEntity.ok("Matchmaking is already running");
            }
        }
        MatchmakingService matchmakingService = matchmakingServices.stream().filter((service)->{
            if(matchmaking == MatchmakingTypes.ranked && service instanceof RankedMatchmakingService){
                return true;
            } else return matchmaking == MatchmakingTypes.unranked && service instanceof UnrankedMatchmakingService;
        }).findFirst().get();
        matchmakingService.joinMatchmaking(user);
        matchmakingService.matchmake(user);
        return ResponseEntity.ok("Matchmaking started");
    }

    @GetMapping("/cancel")
    public ResponseEntity<String> cancelMatchmaking(@RequestHeader("Authorization") String token){
        Session session = sessionRepo.findByToken(token).orElse(null);
        if(session == null || session.getUser() == null) return ResponseEntity.badRequest().build();
        User user = session.getUser();
        for(MatchmakingService matchmakingService : matchmakingServices) {
            matchmakingService.leaveMatchmaking(user);
        }
        return ResponseEntity.ok("Matchmaking stopped");
    }
}
