package com.tda25be.tda25be.api;


import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.SessionRepo;
import com.tda25be.tda25be.repositories.UserRepo;
import com.tda25be.tda25be.requests.UserCreateRequest;
import com.tda25be.tda25be.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController()
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {
    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;
    private final AuthService authService;

        @PostMapping
        public ResponseEntity<User> createUser(@RequestBody UserCreateRequest request) {
            User user = authService.register(request.getEmail(), request.getPassword(), request.getUsername(), request.getElo());
            if(user == null) return ResponseEntity.badRequest().build(); //TODO exception handler global
            return ResponseEntity.status(201).body(user);
        }

        @GetMapping
        public ResponseEntity<List<User>> getAllUsers() {
            return ResponseEntity.ok(new ArrayList<>(userRepo.findAll()));
        }

        @GetMapping("/{uuid}")
        public ResponseEntity<User> getUserByUuid(@PathVariable String uuid) {
            Optional<User> userOptional = userRepo.findById(uuid);
            if(userOptional.isEmpty()) return ResponseEntity.notFound().build();
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
            userRepo.deleteById(uuid);
            return ResponseEntity.noContent().build();
        }
}
