package com.tda25be.tda25be.entities;

import com.tda25be.tda25be.deserializers.BoardConverter;
import com.tda25be.tda25be.models.Board;
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
    @Convert(converter = BoardConverter.class)
    private Board board;
    @OneToMany
    private List<User> user;
    @ManyToOne
    private User playerX;
    @ManyToOne
    private User playerO;

}
