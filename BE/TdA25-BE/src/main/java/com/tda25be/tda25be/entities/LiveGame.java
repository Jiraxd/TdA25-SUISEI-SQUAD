package com.tda25be.tda25be.entities;

import com.tda25be.tda25be.deserializers.BoardConverter;
import com.tda25be.tda25be.models.Board;
import com.tda25be.tda25be.enums.MatchmakingTypes;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.SneakyThrows;
import lombok.experimental.Accessors;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.ReadOnlyProperty;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Live_game")
@Getter
@Setter
@Accessors(chain = true)
public class LiveGame {
    @Id
    @UuidGenerator
    private String uuid;
    @Column(length = 1024)
    @Convert(converter = BoardConverter.class)
    @NonNull
    private Board board;
    @ReadOnlyProperty
    @CreationTimestamp
    private Timestamp createdAt;
    private MatchmakingTypes matchmakingTypes;
    @ManyToOne
    @NonNull
    private User playerX;
    @ManyToOne
    @NonNull
    private User playerO;

    private Long playerOTime = 480000L;
    private Long playerXTime = 480000L;

    private Long playerOEloBefore = 0L;
    private Long playerXEloBefore= 0L;
    private Long playerOEloAfter= 0L;
    private Long playerXEloAfter= 0L;

    private Boolean finished = false;

    public LiveGame(){
    }
    @SneakyThrows
    public LiveGame(MatchmakingTypes matchmakingType) {
        List<List<String>> boardList = new ArrayList<>();
        for (int i = 0; i < 15; i++) {
            ArrayList<String> row = new ArrayList<>();
            for (int j = 0; j < 15; j++) {
                row.add("");
            }
            boardList.add(row);
        }
        board = new Board(boardList);
        this.matchmakingTypes = matchmakingType;
    }
    public List<User> getUsers(){
        List<User> users = new ArrayList<>();
        users.add(playerX);
        users.add(playerO);
        return users;
    }
}
