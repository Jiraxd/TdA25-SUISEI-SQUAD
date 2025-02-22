package com.tda25be.tda25be.models;

import lombok.Getter;

@Getter
public class SettingsBody {
    String username;
    String email;
    String currentPassword;
    String newPassword;
    String nameColor;
}
