package com.tda25be.tda25be.api;

import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import com.tda25be.tda25be.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/livegame")
@RequiredArgsConstructor
public class LiveGameController {
    private final AuthService authService;
    private final LiveGameRepo liveGameRepo;
    @GetMapping("/liveGame")
    public ResponseEntity<LiveGame> liveGame(@RequestHeader("Authorization") String token){
        if(token == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        User user = authService.verify(token);
        if(user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        LiveGame liveGame = liveGameRepo.findPlayersByUser(user);
        return ResponseEntity.status(HttpStatus.OK).body(liveGame);
    }
}
