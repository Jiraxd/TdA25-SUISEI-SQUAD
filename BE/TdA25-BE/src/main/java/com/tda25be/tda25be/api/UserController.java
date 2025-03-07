package com.tda25be.tda25be.api;


import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.models.SettingsBody;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import com.tda25be.tda25be.repositories.SessionRepo;
import com.tda25be.tda25be.repositories.UserRepo;
import com.tda25be.tda25be.requests.UserCreateRequest;
import com.tda25be.tda25be.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController()
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;
    private final AuthService authService;
    private final LiveGameRepo liveGameRepo;
    private final SessionRepo sessionRepo;
    List<String> colors = Arrays.asList("#1a1a1a", "#caaa1c", "#78ca1c", "#2ca420", "#20beb0", "#2091be", "#6930db", "#db3080", "#c42c48", "#c47d2c");


    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserCreateRequest request) {
        User user = authService.register(request.getEmail(), request.getPassword(), request.getUsername(), request.getElo());
        if (user == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.status(201).body(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(new ArrayList<>(userRepo.findAll()));
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<User> getUserByUuid(@PathVariable String uuid) {
        Optional<User> userOptional = userRepo.findById(uuid);
        if (userOptional.isEmpty()) return ResponseEntity.notFound().build();
        User user = userOptional.get();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<User> updateUser(@PathVariable String uuid, @RequestBody UserCreateRequest request) {
        Optional<User> userOptional = userRepo.findById(uuid);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOptional.get();
        if (request.getElo() != null) user.setElo(request.getElo());
        if (request.getUsername() != null) user.setUsername(request.getUsername());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPassword() != null) user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userRepo.save(user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<Void> deleteUser(@PathVariable String uuid) {
        Optional<User> userOptional = userRepo.findById(uuid);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOptional.get();
        List<Session> sessions = sessionRepo.findByUser(user);
        sessionRepo.deleteAll(sessions);
        List<LiveGame> liveGames = liveGameRepo.findAllByPlayerOOrPlayerX(user, user);
        liveGames.forEach((liveGame -> {
            if(liveGame.getPlayerO().getUuid().equals(user.getUuid())){
                liveGame.setPlayerO(null);
            }
            else {
                liveGame.setPlayerX(null);
            }
        }));
        userRepo.deleteById(uuid);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ban/{uuid}")
    public ResponseEntity<String> banUser(@PathVariable String uuid, @RequestHeader("Authorization") String token) {
        if (token == null || token.isEmpty()) return ResponseEntity.badRequest().build();
        User requester = authService.verify(token);
        if (requester == null) return ResponseEntity.badRequest().build();
        if (!requester.getAdmin()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Optional<User> userOptional = userRepo.findById(uuid);
        if (userOptional.isEmpty()) return ResponseEntity.notFound().build();
        User user = userOptional.get().setBanned(true);
        userRepo.save(user);
        return ResponseEntity.ok("User banned");
    }

    @GetMapping("/unban/{uuid}")
    public ResponseEntity<String> unbanUser(@PathVariable String uuid, @RequestHeader("Authorization") String token) {
        if (token == null || token.isEmpty()) return ResponseEntity.badRequest().build();
        User requester = authService.verify(token);
        if (requester == null) return ResponseEntity.badRequest().build();
        if (!requester.getAdmin()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Optional<User> userOptional = userRepo.findById(uuid);
        if (userOptional.isEmpty()) return ResponseEntity.notFound().build();
        User user = userOptional.get().setBanned(false);
        userRepo.save(user);
        return ResponseEntity.ok("User unbanned");
    }

    @PostMapping("/settings")
    public ResponseEntity<String> updateSettings(@RequestBody SettingsBody settingsBody,
                                                 @RequestHeader("Authorization") String token) {
        User user = authService.verify(token);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();


        String currentPassword = settingsBody.getCurrentPassword();
        String newPassword = settingsBody.getNewPassword();
        String username = settingsBody.getUsername();
        String email = settingsBody.getEmail();
        String nameColor = settingsBody.getNameColor();

        if (username == null || email == null || nameColor == null || nameColor.isEmpty())
            return ResponseEntity.badRequest().body("FAILED_SETTINGS_UPDATE");

        if (currentPassword == null || !passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            return ResponseEntity.badRequest().body("PASSWORD_NO_MATCH");
        }
        if (newPassword != null && !authService.validatePassword(newPassword))
            return ResponseEntity.badRequest().body("PASSWORD_NOT_STRONG_ENOUGH");
        User userToCheck = userRepo.findByUsername(username);
        if (userToCheck != null && !Objects.equals(userToCheck.getUuid(), user.getUuid())) return ResponseEntity.badRequest().body("USERNAME_EXISTS");
        userToCheck = userRepo.findByEmail(email);
        if (userToCheck != null && !Objects.equals(userToCheck.getUuid(), user.getUuid())) return ResponseEntity.badRequest().body("EMAIL_EXISTS");
        if (!colors.contains(nameColor)) return ResponseEntity.badRequest().body("INVALID_NAME_COLOR");
        if (newPassword != null) {
            user.setPasswordHash(passwordEncoder.encode(newPassword));
        }

        user.setUsername(username);
        user.setEmail(email);
        user.setNameColor(nameColor);

        userRepo.save(user);
        return ResponseEntity.ok("Settings updated");
    }

    @DeleteMapping("/user")
    public ResponseEntity<String> deleteUserToken(@RequestHeader("Authorization") String token){
        User user = authService.verify(token);
        if(user == null) return ResponseEntity.badRequest().build();
        userRepo.deleteById(user.getUuid());
        return ResponseEntity.ok("User deleted");
    }
}
