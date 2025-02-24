package com.tda25be.tda25be.api;

import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.SessionRepo;
import com.tda25be.tda25be.services.matchmaking.MatchmakingService;
import com.tda25be.tda25be.enums.MatchmakingTypes;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/matchmaking")
public class MatchmakingController {
    @Autowired
    private MatchmakingService matchmakingServiceRanked;

    @Autowired
    private MatchmakingService matchmakingServiceUnranked;
    private final SessionRepo sessionRepo;

    @GetMapping("/start")
    public ResponseEntity<String> startMatchmaking(@RequestParam MatchmakingTypes matchmaking , @RequestHeader("Authorization") String token){
        if(matchmaking == null || token == null) return ResponseEntity.badRequest().build();
        Session session = sessionRepo.findByToken(token).orElse(null);
        if(session == null || session.getUser() == null) return ResponseEntity.badRequest().build();
        User user = session.getUser();
        if (matchmakingServiceUnranked.isUserMatchmaking(user) || matchmakingServiceRanked.isUserMatchmaking(user)) {
            return ResponseEntity.ok("Matchmaking is already running");
        }
        if(matchmaking == MatchmakingTypes.ranked){
            matchmakingServiceRanked.joinMatchmaking(user);
        }
        if(matchmaking == MatchmakingTypes.unranked){
            matchmakingServiceUnranked.joinMatchmaking(user);
        }
        return ResponseEntity.ok("Matchmaking started");
    }

    @GetMapping("/cancel")
    public ResponseEntity<String> cancelMatchmaking(@RequestHeader("Authorization") String token){
        Session session = sessionRepo.findByToken(token).orElse(null);
        if(session == null || session.getUser() == null) return ResponseEntity.badRequest().build();
        User user = session.getUser();
        matchmakingServiceUnranked.leaveMatchmaking(user);
        matchmakingServiceRanked.leaveMatchmaking(user);
        return ResponseEntity.ok("Matchmaking stopped");
    }
}
