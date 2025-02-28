package com.tda25be.tda25be.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.ReadOnlyProperty;

import java.security.SecureRandom;
import java.sql.Timestamp;
import java.util.Base64;

@Entity
@Table(name="Session")
@Getter
@Setter
@Accessors(chain=true)
public class Session {
    @Id
    @NonNull
    @UuidGenerator
    private String uuid;
    private String token;
    private String deviceName;
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    public User user;
    @ReadOnlyProperty
    @CreationTimestamp
    private Timestamp createdAt;


    public Session(){
        SecureRandom secureRandom = new SecureRandom();
        Base64.Encoder base64Encoder = Base64.getUrlEncoder();
        byte[] randomBytes = new byte[64];
        secureRandom.nextBytes(randomBytes);
        this.token = base64Encoder.encodeToString(randomBytes);
    }
}
