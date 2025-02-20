package com.tda25be.tda25be.requests;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.FetchProfile;

@Setter
@Getter
public class UserCreateRequest {
    private String username;
    private String email;
    private String password;
    private Integer elo;

    public UserCreateRequest() {}

    public UserCreateRequest(String username, String email, String password, int elo) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.elo = elo;
    }

}
