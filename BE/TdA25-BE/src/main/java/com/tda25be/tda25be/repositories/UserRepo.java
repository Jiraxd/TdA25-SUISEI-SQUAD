package com.tda25be.tda25be.repositories;

import com.tda25be.tda25be.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface UserRepo extends JpaRepository<User,String> {
    User findByEmail(String email);

    User findByUsername(String username);
}
