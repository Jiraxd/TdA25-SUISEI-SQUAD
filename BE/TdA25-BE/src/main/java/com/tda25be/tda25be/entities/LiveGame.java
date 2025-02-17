package com.tda25be.tda25be.entities;

import com.tda25be.tda25be.deserializers.BoardConverter;
import com.tda25be.tda25be.models.Board;
import com.tda25be.tda25be.services.matchmaking.MatchmakingTypes;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.SneakyThrows;
import lombok.experimental.Accessors;
import org.hibernate.annotations.UuidGenerator;

import javax.xml.bind.annotation.XmlAccessorOrder;
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
    @Convert(converter = BoardConverter.class)
    @NonNull
    private Board board;
    private MatchmakingTypes matchmakingTypes;
    @OneToMany
    @NonNull
    private List<User> users;
    @ManyToOne
    @NonNull
    private User playerX;
    @ManyToOne
    @NonNull
    private User playerO;
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
        this.users = new ArrayList<>();
    }
}
