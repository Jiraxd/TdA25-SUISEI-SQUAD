package com.tda25be.tda25be.repositories;

import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SessionRepo extends JpaRepository<Session, String> {
    Session findByUserAndDeviceName(User user, String deviceName);
    Optional<Session> findByToken(String token);

}
