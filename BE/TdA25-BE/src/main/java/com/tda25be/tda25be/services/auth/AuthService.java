package com.tda25be.tda25be.services.auth;

import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.SessionRepo;
import com.tda25be.tda25be.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class AuthService {

    private final UserRepo userRepo;
    private final SessionRepo sessionRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepo userRepo, SessionRepo sessionRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.sessionRepo = sessionRepo;
        this.passwordEncoder = passwordEncoder;
    }
    private Session login(User user, String password, String deviceName){
        if (user == null) return null;
        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            Session session = sessionRepo.findByUserAndDeviceName(user, deviceName);
            if (session == null) session = new Session().setUser(user).setDeviceName(deviceName);
            sessionRepo.save(session);
            return session;
        }
        return null;
    }

    public Session loginByUsername(String username, String password, String deviceName) {
        User user = userRepo.findByUsername(username);
        return login(user, password, deviceName);
    }

    public Session loginByEmail(String email, String password, String deviceName) {
        User user = userRepo.findByEmail(email);
        return login(user, password, deviceName);
    }
    public User register(String email, String password, String username, Integer elo) {

        if(userRepo.findByEmail(email) != null) return null;
        User user = new User().setUsername(username).setEmail(email).setPasswordHash(passwordEncoder.encode(password)).setElo(elo);
        userRepo.save(user);
        return user;
    }

    public User register(String email, String password, String username) {
        return register(email, password, username, 400);
    }

    public User verify(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        return sessionRepo.findByToken(token)
                .map(Session::getUser)
                .orElse(null);
    }

    public boolean logout(String token) {
        if (token == null || token.isEmpty() || sessionRepo.findByToken(token).isEmpty()) {
        return false;
    }
        sessionRepo.deleteByToken(token);
        return true;
    }
    public boolean logoutById(String uuid) {
        if (uuid == null || uuid.isEmpty() || sessionRepo.findById(uuid).isEmpty()) {
            return false;
        }
        sessionRepo.deleteById(uuid);
        return true;
    }

    public Boolean validatePassword(String password) {
        if(password == null || password.isEmpty()) return false;
        if (password.length() < 8) {
            return false;
        }

        String specialCharacterRegex = ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*";
        String digitRegex = ".*\\d.*";
        String lowercaseRegex = ".*[a-z].*";
        String uppercaseRegex = ".*[A-Z].*";

        return Pattern.matches(specialCharacterRegex, password) &&
                Pattern.matches(digitRegex, password) &&
                Pattern.matches(lowercaseRegex, password) &&
                Pattern.matches(uppercaseRegex, password);
    }
    public Boolean validateEmail(String email) {
        if(email == null || email.isEmpty()) return false;
        String regexPattern = "^(.+)@(\\S+)$";
        return email.matches(regexPattern);
    }

}
