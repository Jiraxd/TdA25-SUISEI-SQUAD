package com.tda25be.tda25be.api;

import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.UserRepo;
import com.tda25be.tda25be.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepo userRepo;

    @PostMapping("login")
    public ResponseEntity<Session> login(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String password = requestBody.get("password");
        String deviceName = requestBody.get("deviceName");

        if (email == null || password == null || deviceName == null) {
            return ResponseEntity.badRequest().build();
        }

        Session session = authService.login(email, password, deviceName);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(session);
    }

    @PostMapping("register")
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
        if(userRepo.findByEmail(email) != null) return ResponseEntity.badRequest().body("User already exists.");
        authService.register(email, password, username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("verify")
    public ResponseEntity<User> verify(@RequestHeader("Authorization") String token) {
        if (token == null || token.isEmpty()) { return ResponseEntity.badRequest().build(); }
        User user = authService.verify(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        if (!authService.logout(token)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok("Session deleted successfully");
    }
}
