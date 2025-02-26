package com.tda25be.tda25be.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.ReadOnlyProperty;

import java.sql.Timestamp;

@Table(name = "App_User", uniqueConstraints={@UniqueConstraint(columnNames={"email"})})
@Entity
@Getter
@Setter
@Accessors(chain = true)
public class User {
    @Id
    @UuidGenerator
    @ReadOnlyProperty
    private String uuid;
    @ReadOnlyProperty
    @CreationTimestamp
    private Timestamp createdAt;
    @Column(unique=true)
    private String email;
    private String username;
    @NonNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String passwordHash;
    private Boolean banned = false;
    @ReadOnlyProperty
    private Boolean admin = false;
    private int elo = 400;
    private int wins = 0;
    private int losses = 0;
    private int draws = 0;
    private String nameColor = "#1a1a1a";

}
