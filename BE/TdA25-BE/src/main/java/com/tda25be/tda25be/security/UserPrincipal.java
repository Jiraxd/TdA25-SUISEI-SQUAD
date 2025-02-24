package com.tda25be.tda25be.security;

import lombok.Getter;

import java.security.Principal;

public class UserPrincipal implements Principal {
    private final String uuid;
    @Getter
    private final String token;
    public UserPrincipal(String uuid, String token) {
        this.uuid = uuid;
        this.token = token;
    }

    @Override
    public String getName() {
        return uuid;
    }
}
