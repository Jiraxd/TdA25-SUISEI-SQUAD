package com.tda25be.tda25be.security;

import java.security.Principal;

public class UserPrincipal implements Principal {
    private final String uuid;

    public UserPrincipal(String uuid) {
        this.uuid = uuid;
    }

    @Override
    public String getName() {
        return uuid;
    }
}
