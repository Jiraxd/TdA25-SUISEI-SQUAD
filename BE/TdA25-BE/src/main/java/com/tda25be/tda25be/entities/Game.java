package com.tda25be.tda25be.entities;

import com.tda25be.tda25be.deserializers.BoardConverter;
import com.tda25be.tda25be.enums.Difficulty;
import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.models.Board;
import jakarta.persistence.*;
import lombok.*;
import org.apache.coyote.BadRequestException;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Entity
@Table(name = "Game")
@Getter
@Setter
public class Game {
    @Id
    @UuidGenerator
    private String uuid;
    private String name;
    private String createdAt;
    private String updatedAt;
    private GameState gameState;
    private Difficulty difficulty;
    @Getter
    @Column(length = 1024)
    @Convert(converter = BoardConverter.class)
    private Board board;

    public void setBoard(Board board) throws BadRequestException {
        this.board = board;
    }

}
