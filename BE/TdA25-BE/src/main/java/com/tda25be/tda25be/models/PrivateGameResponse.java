package com.tda25be.tda25be.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrivateGameResponse {
    String uuid;
    String code;
    public PrivateGameResponse(String uuid, String code){
        this.code = code;
        this.uuid = uuid;
    }

}
