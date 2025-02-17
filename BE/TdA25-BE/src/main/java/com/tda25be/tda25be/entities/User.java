package com.tda25be.tda25be.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.ReadOnlyProperty;

import java.sql.Timestamp;
import java.util.List;

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
    @NonNull
    private String email;
    @NonNull
    private String username;
    @NonNull
    private String passwordHash;
    private int elo = 400;
    private int win = 0;
    private int losses = 0;
    private int draws = 0;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Session> sessions;
}
