package com.tda25be.tda25be.models;

import com.tda25be.tda25be.entities.User;

public class UserWithTimeStamp {
    public User user;
    public Long timestamp;
    public UserWithTimeStamp(User user) {
        this.user = user;
        this.timestamp = System.currentTimeMillis();
    }
}
