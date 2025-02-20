package com.tda25be.tda25be.api;

import com.tda25be.tda25be.entities.User;
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
    private final UserRepo userRepo;
    private final MatchmakingService matchmakingService;

    @GetMapping("/start")
    public ResponseEntity<String> startMatchmaking(@RequestParam MatchmakingTypes matchmaking , @RequestHeader("Authorization") String token){
        if(matchmaking == null || token == null) return ResponseEntity.badRequest().build();
        User user = userRepo.findById(token).orElse(null);
        if(user == null) return ResponseEntity.notFound().build();
        MatchmakingService matchmakingService = matchmakingServices.stream().filter((service)->{
            if(matchmaking == MatchmakingTypes.ranked && service instanceof RankedMatchmakingService){
                return true;
            } else if (matchmaking == MatchmakingTypes.unranked && service instanceof UnrankedMatchmakingService) {
                return true;
            }
            return false;
        }).findFirst().get();
        matchmakingService.joinMatchmaking(user);
        matchmakingService.matchmake(user);
        return ResponseEntity.ok("Matchmaking started");
    }

    @GetMapping("/cancel")
    public ResponseEntity<String> cancelMatchmaking(@RequestHeader("Authorization") String token){
        User user = userRepo.findById(token).orElse(null);
        if(user == null) return ResponseEntity.notFound().build();
        matchmakingService.leaveMatchmaking(user);
        return ResponseEntity.ok("Matchmaking stopped");
    }
}
