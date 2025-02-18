package com.tda25be.tda25be.entities;

import com.tda25be.tda25be.deserializers.BoardConverter;
import com.tda25be.tda25be.enums.Difficulty;
import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.models.Board;
import io.micrometer.common.lang.NonNullApi;
import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;
import org.apache.coyote.BadRequestException;
import org.hibernate.annotations.UuidGenerator;

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

    public void setBoard(@NonNull Board board) {
        this.board = board;
    }

}
