package com.tda25be.tda25be.repositories;

import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepo extends JpaRepository<Session, String> {
    Session findByUserAndDeviceName(User user, String deviceName);

}
