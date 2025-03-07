package com.tda25be.tda25be.api;

import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.SessionRepo;
import com.tda25be.tda25be.repositories.UserRepo;
import com.tda25be.tda25be.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepo userRepo;
    private final SessionRepo sessionRepo;

    @PostMapping("/login")
    public ResponseEntity<Session> login(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String deviceName = requestBody.get("deviceName");
        String username = requestBody.get("username");
        if ((email == null && username == null) || password == null || deviceName == null) {
            return ResponseEntity.badRequest().build();
        }

        Session session = email == null ? authService.loginByUsername(username, password, deviceName) : authService.loginByEmail(email, password, deviceName);
        if (session == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(session);
    }

    @GetMapping
    public ResponseEntity<List<Session>> getSessions(User user) {
        List<Session> sessions = sessionRepo.findByUser((user));
        List<Session> filteredSessions = new ArrayList<>();
        sessions.forEach(session -> filteredSessions.add(session.setToken(null)));
        return new ResponseEntity<>(filteredSessions, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String username = requestBody.get("username");

        if (email == null) {
            return ResponseEntity.badRequest().body("Email not specified.");
        } else if (password == null) {
            return ResponseEntity.badRequest().body("Password not specified.");
        } else if (username == null) {
            return ResponseEntity.badRequest().body("Username not specified.");
        }
        Boolean correctEmail = authService.validateEmail(email);
        Boolean correctPassword = authService.validatePassword(password);
        if(!correctEmail || !correctPassword) return ResponseEntity.badRequest().body("PASSWORD_INVALID_REGISTER");
        if(userRepo.findByEmail(email) != null || userRepo.findByUsername(username) != null) return ResponseEntity.badRequest().body("USER_ALREADY_EXISTS");
        User user = authService.register(email, password, username);
        if(user == null) return ResponseEntity.badRequest().body("REGISTER_FAILED");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/verify")
    public ResponseEntity<User> verify(@RequestHeader("Authorization") String token) {
        if (token == null || token.isEmpty()) { return ResponseEntity.badRequest().build(); }
        User user = authService.verify(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        if (!authService.logout(token)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok("Session deleted successfully");
    }

    @GetMapping("/logout/{uuid}")
    public ResponseEntity<String> logoutBySessionId(@PathVariable String uuid) {
        if (!authService.logoutById(uuid)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok("Session deleted successfully");
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<Session>> getSessions(@RequestHeader("Authorization") String token) {
        User user = authService.verify(token);
        if(user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        List<Session> sessions = new ArrayList<>();
        for(Session session : sessionRepo.findByUser((user))) {
            session.setToken(null);
            sessions.add(session);
        }
        return ResponseEntity.ok(sessions);
    }
}
