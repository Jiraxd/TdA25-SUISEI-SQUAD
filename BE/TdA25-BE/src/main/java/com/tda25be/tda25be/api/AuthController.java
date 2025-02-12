package com.tda25be.tda25be.api;

import com.tda25be.tda25be.deserializers.Hashing;
import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.SessionRepo;
import com.tda25be.tda25be.repositories.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    UserRepo userRepo;
    SessionRepo sessionRepo;
    public AuthController(UserRepo userRepo, SessionRepo sessionRepo) {
        this.userRepo = userRepo;
        this.sessionRepo = sessionRepo;
    }
    @GetMapping("login")
    public ResponseEntity<Session> login(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String deviceName = requestBody.get("deviceName");
        if(email == null || password == null || deviceName == null) return ResponseEntity.badRequest().build();
        User user = userRepo.findByEmail(email);
        if(user == null) return ResponseEntity.notFound().build();
        if(Objects.equals(Hashing.hash(password), user.getPasswordHash())){
            Session session = sessionRepo.findByUserAndDeviceName(user, deviceName);
            if(session == null) session = new Session().setUser(user).setDeviceName(deviceName);
            sessionRepo.save(session);
            return ResponseEntity.ok(session);
        }
        else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @PostMapping("register")
    public ResponseEntity<Session> register(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String username = requestBody.get("username");
        if(email == null || password == null || username == null) return ResponseEntity.badRequest().build();
        User user = new User().setUsername(username).setEmail(email).setPasswordHash(Hashing.hash(password));
        userRepo.save(user);
        return ResponseEntity.ok().build();
    }
}
