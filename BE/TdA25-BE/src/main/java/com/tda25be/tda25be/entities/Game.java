package com.tda25be.tda25be.entities;

import com.tda25be.tda25be.deserializers.BoardConverter;
import com.tda25be.tda25be.enums.Difficulty;
import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.models.Board;
import io.micrometer.common.lang.NonNullApi;
import jakarta.persistence.*;
import jdk.jfr.Timestamp;
import lombok.*;
import lombok.experimental.Accessors;
import org.antlr.v4.runtime.misc.NotNull;
import org.apache.coyote.BadRequestException;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "Game")
@Getter
@Setter
@Accessors(chain = true)
public class Game {
    @Id
    @UuidGenerator
    private String uuid;
    private String name;
    @CreationTimestamp
    private String createdAt;
    @UpdateTimestamp
    private String updatedAt;
    private GameState gameState;
    private Difficulty difficulty;
    @Getter
    @Column(length = 1024)
    private String board;

    public Game setBoard(@NonNull Board board) {
        this.board = board.board.toString();
        return this;
    }

}
