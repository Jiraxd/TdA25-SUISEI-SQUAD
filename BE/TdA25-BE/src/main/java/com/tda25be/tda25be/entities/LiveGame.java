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
import java.util.UUID;

@Entity
@Table(name = "Live_game")
@Getter
@Setter
@Accessors(chain = true)
public class LiveGame {
    @Id
    private String uuid;
    @Column(length = 1024)
    @Convert(converter = BoardConverter.class)
    @NonNull
    private Board board;
    @ReadOnlyProperty
    @CreationTimestamp
    private Timestamp createdAt;
    private MatchmakingTypes matchmakingType;
    @ManyToOne
    @NonNull
    private User playerX;
    @ManyToOne
    @NonNull
    private User playerO;
    private Long lastTimeUpdateAt = System.currentTimeMillis();
    private Long playerOTime = 480000L;
    private Long playerXTime = 480000L;

    private Integer playerOEloBefore = 0;
    private Integer playerXEloBefore= 0;
    private Integer playerOEloAfter= 0;
    private Integer playerXEloAfter= 0;

    private Boolean finished = false;

    public LiveGame(){
        this.uuid = UUID.randomUUID().toString();
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
        this.matchmakingType = matchmakingType;
    }
    public List<User> getUsers(){
        List<User> users = new ArrayList<>();
        users.add(playerX);
        users.add(playerO);
        return users;
    }
    public void updateTime(){
        long currentMillis = System.currentTimeMillis();
        long diff = currentMillis-this.getLastTimeUpdateAt();
        if(board.isOTurn()) {
            this.setPlayerOTime(Math.max(0, this.getPlayerOTime() - diff));
            this.setLastTimeUpdateAt(currentMillis);
        }
        else{
            this.setPlayerXTime(Math.max(0, this.getPlayerXTime() - diff));
            this.setLastTimeUpdateAt(currentMillis);
    }
        lastTimeUpdateAt = System.currentTimeMillis();
    }
}
