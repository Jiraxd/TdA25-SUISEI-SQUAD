package com.tda25be.tda25be.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.List;

@Entity
@Table(name = "Live_game")
@Getter
@Setter
public class LiveGame {
    @Id
    @UuidGenerator
    private String uuid;
    private String board;
    @OneToMany
    private List<User> user;

}
